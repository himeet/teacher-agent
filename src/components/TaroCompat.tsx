import { forwardRef } from 'react'
import {
  View,
  Text,
  Image,
  Input,
  Textarea,
  ScrollView,
} from '@tarojs/components'
import { normalizeWeappClassName } from '@/lib/weappClassName'

type AnyProps = Record<string, any> & {
  className?: string
  onChange?: (event: any) => void
  onClick?: (event: any) => void
  onKeyDown?: (event: any) => void
}

function normalizeClassProps<T extends AnyProps>(props: T): T {
  if (!props.className) return props
  return {
    ...props,
    className: normalizeWeappClassName(props.className),
  }
}

function normalizeLocalSrc(src?: string) {
  if (!src) return ''
  if (src.startsWith('/images/') || src.startsWith('/assets/')) return src.slice(1)
  return src
}

function normalizeInputEvent(handler?: (event: any) => void) {
  if (!handler) return undefined
  return (event: any) => {
    handler({
      ...event,
      target: {
        ...event?.target,
        value: event?.detail?.value ?? event?.target?.value ?? '',
      },
    })
  }
}

export const Div = forwardRef<any, AnyProps>(function Div({ children, ...props }, ref) {
  return (
    <View ref={ref} {...normalizeClassProps(props)}>
      {children}
    </View>
  )
})

export const Main = Div
export const Section = Div
export const Article = Div
export const Header = Div
export const Footer = Div
export const Aside = Div
export const Nav = Div
export const Ul = Div
export const Li = Div
export const Table = Div
export const Thead = Div
export const Tbody = Div
export const Tr = Div
export const Td = Div
export const Th = Div
export const Form = Div
export const Label = Div

export function Span({ children, ...props }: AnyProps) {
  return <Text {...normalizeClassProps(props)}>{children}</Text>
}

function BlockText({ children, ...props }: AnyProps) {
  return <View {...normalizeClassProps(props)}>{children}</View>
}

export const P = BlockText
export const H1 = BlockText
export const H2 = BlockText
export const H3 = BlockText
export const H4 = BlockText
export const H5 = BlockText
export const H6 = BlockText

export function Img({ src, alt: _alt, ...props }: AnyProps) {
  return <Image src={normalizeLocalSrc(src)} mode="aspectFill" {...normalizeClassProps(props)} />
}

export function CompatButton({ children, type: _type, disabled, ...props }: AnyProps) {
  const { onClick, className = '', ...rest } = props

  return (
    <View
      {...rest}
      aria-disabled={disabled ? 'true' : undefined}
      className={normalizeWeappClassName(`${className} taro-compat-button${disabled ? ' opacity-60 pointer-events-none' : ''}`) as string}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </View>
  )
}

export const ButtonCompat = CompatButton

export const CompatInput = forwardRef<any, AnyProps>(function CompatInput(
  { onChange, onKeyDown: _onKeyDown, type = 'text', ...props },
  ref,
) {
  return (
    <Input
      ref={ref}
      type={type === 'date' ? 'text' : type}
      onInput={normalizeInputEvent(onChange)}
      {...normalizeClassProps(props)}
    />
  )
})

export function CompatTextarea({ onChange, rows: _rows, ...props }: AnyProps) {
  return <Textarea onInput={normalizeInputEvent(onChange)} {...normalizeClassProps(props)} />
}

export function SelectCompat({ children, ...props }: AnyProps) {
  return <View {...normalizeClassProps(props)}>{children}</View>
}

export function OptionCompat({ children, ...props }: AnyProps) {
  return <Text {...normalizeClassProps(props)}>{children}</Text>
}

export function ScrollContainer({ children, ...props }: AnyProps) {
  return <ScrollView scrollY {...normalizeClassProps(props)}>{children}</ScrollView>
}
