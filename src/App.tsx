import './App.css'
import Toggle from "./lib/toggle";
import ApiKeyInput from "./lib/apikey";
import {useApiKey} from "./lib/useApiKey";

function App() {
  // undefined = waiting, null = not set, string = set
  const { apiKey, handleApiKeyChange } = useApiKey();

  return (
    <div className="h-full">
      <h1 className="text-3xl font-bold">

      </h1>
      <div>
        Active: <Toggle />
        {apiKey !== undefined &&
          <ApiKeyInput apiKey={apiKey || ""} onApiKeyChange={handleApiKeyChange}/>
        }
      </div>
    </div>
  )
}

export default App
