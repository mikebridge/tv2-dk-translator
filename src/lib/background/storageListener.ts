// SEE: https://developer.chrome.com/docs/extensions/reference/api/storage

import {
  createGetApiKeyResponse, createGetKeyValueSyncResponse,
  isGetApiKeyRequest, isGetKeyValueSyncRequest,
  isSetApiKeyRequest,
  isSetKeyValueSyncRequest
} from "../common/messages";

const LOCAL_STORAGE_OPENAI_API_KEY = 'openAiApiKey';

export const getValueFromLocalStorage = (key: string) => new Promise<string | undefined>((resolve) => {
  chrome.storage.local.get(key, (response) => {
    resolve(response[key]);
  });
});

const setValueInLocalStorage = (key: string, value: string | undefined) => {
  chrome.storage.local.set({[key]: value}, () => {});
}

const removeValueFromLocalStorage = (key: string) => {
  chrome.storage.local.remove(key, () => {})
}

export const getValueFromSyncStorage = (key: string) => new Promise<string | undefined>((resolve) => {
  chrome.storage.sync.get(key, (response) => {
    resolve(response[key]);
  });
});

export const setValueInSyncStorage = <T>(key: string, value: T) => {
  chrome.storage.sync.set({[key]: value}, () => {});
};

export const getOpenAiApiKeyFromLocalStorage = (): Promise<string | undefined> =>
  getValueFromLocalStorage(LOCAL_STORAGE_OPENAI_API_KEY);

/**
 * return true if there's a listener waiting for a response.  Otherwise,
 * return false.
 *
 * Note that addlistener cannot be async, apparently.
 */
export const initializeStorageListener = () => {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    // console.log("StorageListener: Storage listener hears");
    // console.dir(message);
    if (isGetApiKeyRequest(message)) {
      // get the key from local storage if it exists
      getOpenAiApiKeyFromLocalStorage().then((apiKey) => {
        sendResponse(createGetApiKeyResponse(apiKey));
      }).catch(console.error);
      return true;
    }
    if (isSetApiKeyRequest(message)) {
      if (message.data.value === undefined) {
        removeValueFromLocalStorage(LOCAL_STORAGE_OPENAI_API_KEY);
      } else {
        setValueInLocalStorage(LOCAL_STORAGE_OPENAI_API_KEY, message.data.value);
      }
      return false;
    }
    if (isSetKeyValueSyncRequest(message)) {
      setValueInSyncStorage(message.data.key, message.data.value);
      return false;
    }
    if (isGetKeyValueSyncRequest(message)) {
      getValueFromLocalStorage(message.data.key).then((value) =>
        sendResponse(createGetKeyValueSyncResponse(message.data.key, value)))
      return true;
    }
    return false;
  });
};
