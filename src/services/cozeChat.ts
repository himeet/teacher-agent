import Taro from '@tarojs/taro'

const COZE_PROXY_PATH = '/api/coze/stream_run'
const COZE_STREAM_URL = 'https://z94mvp2yjk.coze.site/stream_run'
const COZE_AUTH_TOKEN = 'pat_GPLg5pLg7j6pyJx3Ev1VdHfBxkeTGrBynfkRz888D9WxQ4bG8lSaqhJ52mnhYdmd'
const COZE_SESSION_ID = 'Z0rZi1F9KXveFsbZ-5m_5'
const COZE_PROJECT_ID = '7628158541953515546'
const COZE_REQUEST_TIMEOUT_MS = 180000

type CozeStreamCallbacks = {
  onDelta: (text: string) => void
}

type CozeStreamPayload = {
  type?: string
  finish?: boolean
  content?: {
    answer?: string | null
    error?: { message?: string } | string | null
  }
}

type CozeStreamError = NonNullable<CozeStreamPayload['content']>['error']

function buildRequestBody(prompt: string) {
  const escapedPrompt = JSON.stringify(prompt)
  const escapedSessionId = JSON.stringify(COZE_SESSION_ID)

  // project_id is larger than Number.MAX_SAFE_INTEGER, so keep the exact JSON literal.
  return `{"content":{"query":{"prompt":[{"type":"text","content":{"text":${escapedPrompt}}}]}},"type":"query","session_id":${escapedSessionId},"project_id":${COZE_PROJECT_ID}}`
}

function getCozeStreamUrl() {
  return COZE_PROXY_PATH
}

function getRequestHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
  }
}

function getWeappRequestHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
    Authorization: `Bearer ${COZE_AUTH_TOKEN}`,
  }
}

function readErrorMessage(error: CozeStreamError) {
  if (!error) return ''
  if (typeof error === 'string') return error
  return error.message || ''
}

function handleSseEventBlock(block: string, callbacks: CozeStreamCallbacks) {
  const data = block
    .split(/\r?\n/)
    .filter(line => line.startsWith('data:'))
    .map(line => line.replace(/^data:\s?/, ''))
    .join('\n')
    .trim()

  if (!data || data === '[DONE]') return

  let payload: CozeStreamPayload
  try {
    payload = JSON.parse(data)
  } catch {
    return
  }

  const errorMessage = readErrorMessage(payload.content?.error)
  if (errorMessage) {
    throw new Error(errorMessage)
  }

  if (payload.type === 'answer' && typeof payload.content?.answer === 'string') {
    callbacks.onDelta(payload.content.answer)
  }
}

function consumeBufferedSseText(buffer: string, callbacks: CozeStreamCallbacks) {
  let rest = buffer

  while (rest.length > 0) {
    const separatorMatch = rest.match(/\r?\n\r?\n/)
    if (separatorMatch?.index === undefined) break

    const block = rest.slice(0, separatorMatch.index)
    rest = rest.slice(separatorMatch.index + separatorMatch[0].length)
    handleSseEventBlock(block, callbacks)
  }

  return rest
}

function decodeArrayBuffer(buffer: ArrayBuffer) {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder('utf-8').decode(buffer)
  }

  let binary = ''
  const bytes = new Uint8Array(buffer)

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index])
  }

  try {
    return decodeURIComponent(escape(binary))
  } catch {
    return binary
  }
}

function streamCozeChatAnswerWithXhr(
  streamUrl: string,
  prompt: string,
  callbacks: CozeStreamCallbacks,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const headers = getRequestHeaders()
    let readOffset = 0
    let buffer = ''
    let settled = false

    const finishWithError = (error: unknown) => {
      if (settled) return
      settled = true
      xhr.abort()
      reject(error instanceof Error ? error : new Error('AI 服务请求失败，请稍后再试。'))
    }

    const appendResponseText = () => {
      const nextText = xhr.responseText.slice(readOffset)
      readOffset = xhr.responseText.length
      if (!nextText) return

      buffer += nextText
      buffer = consumeBufferedSseText(buffer, callbacks)
    }

    xhr.open('POST', streamUrl, true)
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })

    xhr.onprogress = () => {
      if (settled) return
      try {
        appendResponseText()
      } catch (error) {
        finishWithError(error)
      }
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE || settled) return

      if (xhr.status < 200 || xhr.status >= 300) {
        finishWithError(new Error(`AI 服务请求失败（${xhr.status}）`))
        return
      }

      try {
        appendResponseText()
        if (buffer.trim()) {
          handleSseEventBlock(buffer, callbacks)
        }
        settled = true
        resolve()
      } catch (error) {
        finishWithError(error)
      }
    }

    xhr.onerror = () => finishWithError(new Error('AI 服务网络请求失败，请稍后再试。'))
    xhr.ontimeout = () => finishWithError(new Error('AI 服务请求超时，请稍后再试。'))
    xhr.send(buildRequestBody(prompt))
  })
}

async function streamCozeChatAnswerWithFetch(
  streamUrl: string,
  prompt: string,
  callbacks: CozeStreamCallbacks,
) {
  if (typeof fetch !== 'function') {
    throw new Error('当前运行环境不支持流式 fetch，请通过服务端代理转发该接口。')
  }

  const response = await fetch(streamUrl, {
    method: 'POST',
    headers: getRequestHeaders(),
    body: buildRequestBody(prompt),
  })

  if (!response.ok) {
    throw new Error(`AI 服务请求失败（${response.status}）`)
  }

  if (!response.body) {
    const text = await response.text()
    const rest = consumeBufferedSseText(`${text}\n\n`, callbacks)
    if (rest.trim()) handleSseEventBlock(rest, callbacks)
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    buffer = consumeBufferedSseText(buffer, callbacks)

    if (done) break
  }

  if (buffer.trim()) {
    handleSseEventBlock(buffer, callbacks)
  }
}

function streamCozeChatAnswerWithTaroRequest(
  prompt: string,
  callbacks: CozeStreamCallbacks,
) {
  return new Promise<void>((resolve, reject) => {
    let buffer = ''
    let hasChunk = false
    let settled = false

    const finishWithError = (error: unknown) => {
      if (settled) return
      settled = true
      reject(error instanceof Error ? error : new Error('AI 服务请求失败，请稍后再试。'))
    }

    const readRequestError = (error: any) => {
      if (!error) return 'AI 服务请求失败，请稍后再试。'
      if (typeof error === 'string') return error
      const message = error.errMsg || error.message || ''
      if (message.toLowerCase().includes('timeout')) {
        return 'AI 服务请求超时，请稍后重试或缩短问题内容。'
      }
      return message || 'AI 服务请求失败，请稍后再试。'
    }

    const requestTask = Taro.request<string>({
      url: COZE_STREAM_URL,
      method: 'POST',
      header: getWeappRequestHeaders(),
      data: buildRequestBody(prompt),
      dataType: '其他',
      responseType: 'text',
      enableChunked: true,
      timeout: COZE_REQUEST_TIMEOUT_MS,
      success: (response) => {
        if (settled) return

        if (response.statusCode < 200 || response.statusCode >= 300) {
          finishWithError(new Error(`AI 服务请求失败（${response.statusCode}）`))
          return
        }

        try {
          if (!hasChunk && typeof response.data === 'string') {
            buffer += response.data
          }

          buffer = consumeBufferedSseText(`${buffer}\n\n`, callbacks)
          if (buffer.trim()) {
            handleSseEventBlock(buffer, callbacks)
          }

          settled = true
          resolve()
        } catch (error) {
          finishWithError(error)
        }
      },
      fail: (error) => finishWithError(new Error(readRequestError(error))),
    })

    requestTask.onChunkReceived?.((result) => {
      if (settled) return

      try {
        hasChunk = true
        buffer += decodeArrayBuffer(result.data)
        buffer = consumeBufferedSseText(buffer, callbacks)
      } catch (error) {
        console.error('Coze chunk decode error:', error)
        requestTask.abort?.()
        finishWithError(error)
      }
    })
  })
}

export async function streamCozeChatAnswer(prompt: string, callbacks: CozeStreamCallbacks) {
  if (process.env.TARO_ENV === 'weapp') {
    await streamCozeChatAnswerWithTaroRequest(prompt, callbacks)
    return
  }

  const streamUrl = getCozeStreamUrl()

  if (typeof window !== 'undefined' && typeof XMLHttpRequest === 'function') {
    await streamCozeChatAnswerWithXhr(streamUrl, prompt, callbacks)
    return
  }

  await streamCozeChatAnswerWithFetch(streamUrl, prompt, callbacks)
}
