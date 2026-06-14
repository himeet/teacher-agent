import { useState } from 'react'
import '../App.css'
import * as TaroCompat from '@/components/TaroCompat';

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TaroCompat.H1>Vite + React</TaroCompat.H1>
      <TaroCompat.Div className="card">
        <TaroCompat.ButtonCompat onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </TaroCompat.ButtonCompat>
        <TaroCompat.P>
          Edit <code>src/App.tsx</code> and save to test HMR
        </TaroCompat.P>
      </TaroCompat.Div>
    </>
  )
}
