import { memo, useMemo } from 'react'
import type { ReactNode } from 'react'
import * as TaroCompat from '@/components/TaroCompat'

type InlineToken =
  | { type: 'text'; text: string }
  | { type: 'strong'; children: InlineToken[] }
  | { type: 'em'; children: InlineToken[] }
  | { type: 'code'; text: string }
  | { type: 'link'; text: string; href: string }

type MarkdownBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'unorderedList'; items: string[] }
  | { type: 'orderedList'; items: string[] }
  | { type: 'blockquote'; text: string }
  | { type: 'code'; text: string; language: string }

function isBlockStart(line: string) {
  return (
    /^\s*```/.test(line) ||
    /^\s{0,3}(#{1,6})\s+/.test(line) ||
    /^\s*>\s?/.test(line) ||
    /^\s*[-*+]\s+/.test(line) ||
    /^\s*\d+[.)]\s+/.test(line)
  )
}

function parseBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) {
      index += 1
      continue
    }

    const codeFence = line.match(/^\s*```\s*(.*)$/)
    if (codeFence) {
      const codeLines: string[] = []
      index += 1

      while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) {
        codeLines.push(lines[index])
        index += 1
      }

      if (index < lines.length) index += 1
      blocks.push({ type: 'code', language: (codeFence[1] ?? '').trim(), text: codeLines.join('\n') })
      continue
    }

    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+)$/)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() })
      index += 1
      continue
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = []
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ''))
        index += 1
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join('\n').trim() })
      continue
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^\s*[-*+]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*+]\s+/, '').trim())
        index += 1
      }
      blocks.push({ type: 'unorderedList', items })
      continue
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+[.)]\s+/, '').trim())
        index += 1
      }
      blocks.push({ type: 'orderedList', items })
      continue
    }

    const paragraphLines: string[] = []
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }

    if (paragraphLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join('\n') })
    } else {
      blocks.push({ type: 'paragraph', text: line.trim() })
      index += 1
    }
  }

  return blocks
}

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let rest = text

  while (rest.length > 0) {
    const match = rest.match(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/)

    if (!match || match.index === undefined) {
      tokens.push({ type: 'text', text: rest })
      break
    }

    if (match.index > 0) {
      tokens.push({ type: 'text', text: rest.slice(0, match.index) })
    }

    const raw = match[0]
    if (raw.startsWith('**') && raw.endsWith('**')) {
      tokens.push({ type: 'strong', children: parseInline(raw.slice(2, -2)) })
    } else if (raw.startsWith('`') && raw.endsWith('`')) {
      tokens.push({ type: 'code', text: raw.slice(1, -1) })
    } else if (raw.startsWith('[')) {
      const link = raw.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      tokens.push(link ? { type: 'link', text: link[1], href: link[2] } : { type: 'text', text: raw })
    } else if (raw.startsWith('*') && raw.endsWith('*')) {
      tokens.push({ type: 'em', children: parseInline(raw.slice(1, -1)) })
    } else {
      tokens.push({ type: 'text', text: raw })
    }

    rest = rest.slice(match.index + raw.length)
  }

  return tokens
}

function renderInline(text: string, keyPrefix: string) {
  return parseInline(text).map((token, index) => {
    const key = `${keyPrefix}-${index}`

    if (token.type === 'text') return token.text
    if (token.type === 'strong') {
      return (
        <TaroCompat.Span key={key} className="md-strong">
          {renderInlineFromTokens(token.children, key)}
        </TaroCompat.Span>
      )
    }
    if (token.type === 'em') {
      return (
        <TaroCompat.Span key={key} className="md-em">
          {renderInlineFromTokens(token.children, key)}
        </TaroCompat.Span>
      )
    }
    if (token.type === 'code') {
      return (
        <TaroCompat.Span key={key} className="md-inline-code">
          {token.text}
        </TaroCompat.Span>
      )
    }

    return (
      <TaroCompat.Span key={key} className="md-link">
        {token.text}
      </TaroCompat.Span>
    )
  })
}

function renderInlineFromTokens(tokens: InlineToken[], keyPrefix: string): ReactNode[] {
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-nested-${index}`

    if (token.type === 'text') return token.text
    if (token.type === 'strong') {
      return (
        <TaroCompat.Span key={key} className="md-strong">
          {renderInlineFromTokens(token.children, key)}
        </TaroCompat.Span>
      )
    }
    if (token.type === 'em') {
      return (
        <TaroCompat.Span key={key} className="md-em">
          {renderInlineFromTokens(token.children, key)}
        </TaroCompat.Span>
      )
    }
    if (token.type === 'code') {
      return (
        <TaroCompat.Span key={key} className="md-inline-code">
          {token.text}
        </TaroCompat.Span>
      )
    }

    return (
      <TaroCompat.Span key={key} className="md-link">
        {token.text}
      </TaroCompat.Span>
    )
  })
}

function renderTextLines(text: string, keyPrefix: string) {
  return text.split('\n').map((line, index, lines) => (
    <TaroCompat.Span key={`${keyPrefix}-line-${index}`}>
      {renderInline(line, `${keyPrefix}-line-${index}`)}
      {index < lines.length - 1 ? '\n' : ''}
    </TaroCompat.Span>
  ))
}

type MarkdownContentProps = {
  content: string
  trailing?: ReactNode
}

function MarkdownContent({ content, trailing }: MarkdownContentProps) {
  const blocks = useMemo(() => parseBlocks(content), [content])

  if (!blocks.length) {
    return <TaroCompat.Div className="md-content">{trailing}</TaroCompat.Div>
  }

  return (
    <TaroCompat.Div className="md-content">
      {blocks.map((block, index) => {
        const key = `md-block-${index}`
        const isLastBlock = index === blocks.length - 1
        const trailingNode = isLastBlock ? trailing : null

        if (block.type === 'heading') {
          return (
            <TaroCompat.Div key={key} className={`md-heading md-heading-${Math.min(block.level, 4)}`}>
              {renderInline(block.text, key)}
              {trailingNode}
            </TaroCompat.Div>
          )
        }

        if (block.type === 'paragraph') {
          return (
            <TaroCompat.Div key={key} className="md-paragraph">
              {renderTextLines(block.text, key)}
              {trailingNode}
            </TaroCompat.Div>
          )
        }

        if (block.type === 'blockquote') {
          return (
            <TaroCompat.Div key={key} className="md-blockquote">
              {renderTextLines(block.text, key)}
              {trailingNode}
            </TaroCompat.Div>
          )
        }

        if (block.type === 'code') {
          return (
            <TaroCompat.Div key={key} className="md-code-block">
              {block.text}
              {trailingNode}
            </TaroCompat.Div>
          )
        }

        if (block.type === 'orderedList') {
          return (
            <TaroCompat.Div key={key} className="md-list">
              {block.items.map((item, itemIndex) => (
                <TaroCompat.Div key={`${key}-item-${itemIndex}`} className="md-list-item">
                  <TaroCompat.Span className="md-list-marker">{itemIndex + 1}.</TaroCompat.Span>
                  <TaroCompat.Span className="md-list-text">
                    {renderInline(item, `${key}-item-${itemIndex}`)}
                    {itemIndex === block.items.length - 1 ? trailingNode : null}
                  </TaroCompat.Span>
                </TaroCompat.Div>
              ))}
            </TaroCompat.Div>
          )
        }

        return (
          <TaroCompat.Div key={key} className="md-list">
            {block.items.map((item, itemIndex) => (
              <TaroCompat.Div key={`${key}-item-${itemIndex}`} className="md-list-item">
                <TaroCompat.Span className="md-list-marker">-</TaroCompat.Span>
                <TaroCompat.Span className="md-list-text">
                  {renderInline(item, `${key}-item-${itemIndex}`)}
                  {itemIndex === block.items.length - 1 ? trailingNode : null}
                </TaroCompat.Span>
              </TaroCompat.Div>
            ))}
          </TaroCompat.Div>
        )
      })}
    </TaroCompat.Div>
  )
}

export default memo(MarkdownContent)
