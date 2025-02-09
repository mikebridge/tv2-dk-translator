import { useState, useEffect } from 'react';
import {createGetApiKeyRequest, createSetApiKeyRequest, isGetApiKeyResponse} from "../common/messages";

const retrieveApiKey = async (): Promise<string | undefined> => {
  console.log("calling retrieveApiKey");
  return new Promise<string | undefined>((resolve, reject) => {
    const request = createGetApiKeyRequest();
    console.log('retrieveApiKey: sending Request...');
    chrome.runtime.sendMessage(request, (response) => {
      if (chrome.runtime.lastError) {
        console.error("useApiKey: Runtime error:", chrome.runtime.lastError);
      } else {
        console.log("useApiKey: Received response from background:", response);
      }

      if (isGetApiKeyResponse(response)) {
        resolve(response.data.text);
      } else {
        reject('Error retrieving API key');
        console.error(response);
      }
    });
  });
};

/**
 * Send the api key to the backend.  If undefined, it should unset it.
 * @param apiKey
 */
const saveApiKey = (apiKey: string | undefined) => {
  const request = createSetApiKeyRequest(apiKey);
  console.log("SENDING API KEY");
  chrome.runtime.sendMessage(request).catch(console.error);
};

/**
 * if the key is undefined, it's still being retrieved.  If it's null, there is no
 * value for it.  Otherwise it's a string.
 */
export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | undefined | null>(undefined);

  useEffect(() => {
    const fetchApiKey = async () => {
      console.log("... retrieving key")
      const key = await retrieveApiKey();
      console.log("... found key: " + key)
      setApiKey(key || null);
    };
    fetchApiKey().catch(console.error);
  }, []);

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    if (newApiKey.trim() === '') {
      saveApiKey(undefined);
    } else {
      saveApiKey(newApiKey);
    }
  };

  return { apiKey, handleApiKeyChange };
};
