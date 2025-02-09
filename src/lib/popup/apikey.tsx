import {useState} from "react";

interface ApiKeyInputProps {
  apiKey: string
  onApiKeyChange: (newApiKey: string) => void
}

const validateApiKey = (key: string): boolean => {
  //API key should start with "sk-" and be at least 20 characters long
  return key.startsWith("sk-") && key.length >= 20;
};

const OPEN_API_KEY_URL = "https://platform.openai.com/api-keys";

/**
 * set the openapi key
 * @constructor
 */
export default function ApiKeyInput({ apiKey: initialApiKey, onApiKeyChange } : ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = event.target.value;
    setApiKey(newApiKey);
    if (validateApiKey(newApiKey)) {
      setError(null);
      onApiKeyChange(newApiKey);
    } else {
      setError("Invalid API key format.");
    }
  };

  return (
    <>
      <div>
        <label htmlFor="apikey" className="block text-left text-sm/6 font-medium text-gray-900">
          OpenAI API Key
        </label>
        <div className="mt-2">
          <input
            id="apikey"
            name="apikey"
            type="password"
            required
            autoComplete="current-password"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            value={apiKey}
            onChange={handleChange}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      </div>
      <div className="flex justify-end">
        <a href={OPEN_API_KEY_URL} target="_blank" className="text-blue-500">obtain an api key</a>
      </div>
    </>
  )
}
