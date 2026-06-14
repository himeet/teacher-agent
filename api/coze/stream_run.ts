type NodeRequest = {
  method?: string
  on: (event: 'data' | 'end' | 'error', listener: (...args: any[]) => void) => void
}

type NodeResponse = {
  statusCode: number
  setHeader: (name: string, value: string | number | readonly string[]) => void
  removeHeader?: (name: string) => void
  write: (chunk: Uint8Array | Buffer | string) => void
  end: (chunk?: Uint8Array | Buffer | string) => void
  headersSent?: boolean
}

const DEFAULT_COZE_STREAM_URL = 'https://z94mvp2yjk.coze.site/stream_run'

export const config = {
  maxDuration: 60,
}

function readRequestBody(req: NodeRequest) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []

    req.on('data', chunk => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function writeCorsHeaders(res: NodeResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')
}

function writeJsonError(res: NodeResponse, statusCode: number, message: string) {
  if (res.headersSent) {
    res.end()
    return
  }

  writeCorsHeaders(res)
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ error: message }))
}

export default async function handler(req: NodeRequest, res: NodeResponse) {
  writeCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'POST') {
    writeJsonError(res, 405, 'Method Not Allowed')
    return
  }

  const authToken = process.env.COZE_AUTH_TOKEN
  const streamUrl = process.env.COZE_STREAM_URL || DEFAULT_COZE_STREAM_URL

  if (!authToken) {
    writeJsonError(res, 500, 'Missing COZE_AUTH_TOKEN')
    return
  }

  try {
    const requestBody = await readRequestBody(req)
    const upstream = await fetch(streamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        'Accept-Encoding': 'identity',
        Authorization: `Bearer ${authToken}`,
      },
      body: requestBody,
    })

    res.statusCode = upstream.status
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.removeHeader?.('Content-Encoding')
    res.removeHeader?.('Content-Length')

    if (!upstream.body) {
      res.end()
      return
    }

    const reader = upstream.body.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(Buffer.from(value))
    }

    res.end()
  } catch (error) {
    console.error('Coze stream proxy error:', error)
    writeJsonError(res, 500, 'stream_proxy_error')
  }
}
