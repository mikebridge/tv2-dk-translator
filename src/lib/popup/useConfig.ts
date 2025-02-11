import { useState, useEffect, useCallback } from "react";
import {
  createGetKeyValueSyncRequest,
  createSetKeyValueSyncRequest,
  isGetKeyValueSyncResponse
} from "../common/messages";

/**
 * Allow retrieval from sync storage.  A value is undefined until it is fetched.
 *
 * The retrieval is async, so you should wait until isLoaded is true before using the value.
 * @param key
 */
export const useConfiguration = <T>(key: string) => {
  const [value, setValue] = useState<T | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [rawResponse, setRawResponse] = useState(undefined)

  // Fetch the value from the backend when the hook is mounted
  useEffect(() => {
    const fetchValue = async () => {
      console.log("useConfig is asking for key: " + key);
      const getValueRequest = createGetKeyValueSyncRequest(key);
      const response = await chrome.runtime.sendMessage(getValueRequest);
      console.log("useConfig response is ", response);
      setRawResponse(response)
      if (isGetKeyValueSyncResponse<T>(response)) {
        if (response && response.data.value !== undefined) {
          setValue(response.data.value);
        }
      }
      setIsLoaded(true);
    };

    fetchValue().catch(console.error);
  }, [key]);

  // Function to update the value in the backend and state
  const updateValue = useCallback(
    async (newValue: T) => {
      // console.log("useConfig is asking to set key: " + key + " with " + value);
      const setValueRequest = createSetKeyValueSyncRequest<T>(key, newValue)
      await chrome.runtime.sendMessage(setValueRequest);
      setValue(newValue);
    },
    [key]
  );

  return [value, updateValue, isLoaded, rawResponse] as const;
};
