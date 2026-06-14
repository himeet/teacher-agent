import type { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import './index.css'
import './App.css'

function App({ children }: PropsWithChildren) {
  useLaunch(() => {})

  return children
}

export default App
