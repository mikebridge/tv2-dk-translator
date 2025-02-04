import { useState } from 'react'
import './App.css'
import Toggle from "./lib/toggle";
import ApiKeyInput from "./lib/apikey";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="h-full">
      <h1 className="text-3xl font-bold">
        Hello, world! wefwefwefwefwefwefwefew
      </h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <Toggle />
        <ApiKeyInput />
      </div>
    </div>
  )
}

export default App
