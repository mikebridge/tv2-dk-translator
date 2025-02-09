// import './App.css'
import Toggle from "./lib/popup/toggle";
import ApiKeyInput from "./lib/popup/apikey";
import {useApiKey} from "./lib/popup/useApiKey";

function App() {
  // undefined = waiting, null = not set, string = set
  const { apiKey, handleApiKeyChange } = useApiKey();

  return (
    <div className="h-full bg-gradient-to-r from-red-500 to-orange-500">
      <h1 className="text-4xl font-bold text-white text-center mb-8 pt-6">
        TV2 Subtitle Translator
      </h1>

      <div className="flex min-h-full flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-8 py-10 shadow-xl rounded-lg border border-gray-200">
            <form action="#" method="POST" className="space-y-6">
              <div className="flex items-center justify-between">
                <label htmlFor="toggle" className="text-lg font-medium text-gray-700">Active:</label>
                <Toggle/>
              </div>
              {apiKey !== undefined && (
                <ApiKeyInput
                  apiKey={apiKey || ""}
                  onApiKeyChange={handleApiKeyChange}
                />
              )}
              <button
                type="button"
                onClick={() => window.close()}
                className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-md shadow-lg hover:opacity-90 transition"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
