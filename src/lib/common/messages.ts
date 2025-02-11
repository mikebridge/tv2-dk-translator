import {
  GET_CHATGPT_API_KEY_REQUEST,
  GET_CHATGPT_API_KEY_RESPONSE,
  GET_KEY_VALUE_SYNC_REQUEST,
  GET_KEY_VALUE_SYNC_RESPONSE,
  SET_CHATGPT_API_KEY_REQUEST,
  SET_KEY_VALUE_SYNC_REQUEST,
  TRANSLATION_REQUEST,
  TRANSLATION_RESPONSE
} from "./events";

/** GENERAL */

interface Action {
  action: string
}

interface Event<T> extends Action {
  data: T
}

export const isActionMessage = <T extends Action>(
  msg: unknown,
  expectedAction: string
): msg is T => {
  return !!msg && typeof msg === 'object' && 'action' in msg && msg['action'] === expectedAction;
};


/** TRANSLATION **/

interface TranslationRequestData {
  text: string
}

export interface TranslationRequest extends Event<TranslationRequestData> {
  action: typeof TRANSLATION_REQUEST,
  data: TranslationRequestData
}

export const isTranslationRequest = (msg: unknown): msg is TranslationRequest => {
  return isActionMessage<TranslationRequest>(msg, TRANSLATION_REQUEST);
};

export const createTranslationRequest = (text: string): TranslationRequest => ({
  action: TRANSLATION_REQUEST,
  data: {
    text,
  }
})


interface TranslationResponseData {
  text: string
  original: string
}

export interface TranslationResponse extends Event<TranslationResponseData> {
  action: typeof TRANSLATION_RESPONSE,
  data: TranslationResponseData
}

export const isTranslationResponse = (msg: unknown): msg is TranslationResponse => {
  return isActionMessage<TranslationResponse>(msg, TRANSLATION_RESPONSE);
};

export interface SubtitleUpdated {
  action: "subtitleUpdated",
  data: { text: string }
}

export const createTranslationResponse = (text: string, original: string): TranslationResponse => ({
  action: TRANSLATION_RESPONSE,
  data: {
    text,
    original
  }
})

/** STORAGE **/

export interface GetApiKeyRequest extends Event<undefined> {
  action: typeof GET_CHATGPT_API_KEY_REQUEST,
  data: undefined
}

interface ApiKeyResponseData {
  text: string | undefined
}

export interface GetApiKeyResponse extends Event<ApiKeyResponseData> {
  action: typeof GET_CHATGPT_API_KEY_RESPONSE,
  data: ApiKeyResponseData
}

interface SetApiKeyRequestData {
  value: string | undefined
}

export interface SetApiKeyRequest extends Event<SetApiKeyRequestData> {
  action: typeof SET_CHATGPT_API_KEY_REQUEST,
  data: SetApiKeyRequestData
}

interface SetKeyValueSyncRequestData<T> {
  key: string
  value: T | undefined
}

interface GetKeyValueSyncRequestData {
  key: string
}

interface GetKeyValueSyncResponseData<T> {
  key: string
  value: T | undefined
}

export interface SetKeyValueSyncRequest<T> extends Event<SetKeyValueSyncRequestData<T>> {
  action: typeof SET_KEY_VALUE_SYNC_REQUEST,
  data: SetKeyValueSyncRequestData<T>
}

export interface GetKeyValueSyncRequest extends Event<GetKeyValueSyncRequestData> {
  action: typeof GET_KEY_VALUE_SYNC_REQUEST,
  data: GetKeyValueSyncRequestData
}

export interface GetKeyValueSyncResponse<T> extends Event<GetKeyValueSyncResponseData<T>> {
  action: typeof GET_KEY_VALUE_SYNC_RESPONSE,
  data: GetKeyValueSyncResponseData<T>
}

export const isGetApiKeyRequest = (msg: unknown): msg is GetApiKeyRequest =>
  isActionMessage<GetApiKeyRequest>(msg, GET_CHATGPT_API_KEY_REQUEST);

export const isGetApiKeyResponse = (msg: unknown): msg is GetApiKeyResponse =>
  isActionMessage<GetApiKeyResponse>(msg, GET_CHATGPT_API_KEY_RESPONSE);

export const isSetApiKeyRequest = (msg: unknown): msg is SetApiKeyRequest =>
  isActionMessage<SetApiKeyRequest>(msg, SET_CHATGPT_API_KEY_REQUEST);

export const isSetKeyValueSyncRequest = <T>(msg: unknown): msg is SetKeyValueSyncRequest<T> =>
  isActionMessage<SetKeyValueSyncRequest<T>>(msg, SET_KEY_VALUE_SYNC_REQUEST);

export const isGetKeyValueSyncRequest = (msg: unknown): msg is GetKeyValueSyncRequest =>
  isActionMessage<GetKeyValueSyncRequest>(msg, GET_KEY_VALUE_SYNC_REQUEST);

export const isGetKeyValueSyncResponse = <T>(msg: unknown): msg is GetKeyValueSyncResponse<T> =>
  isActionMessage<GetKeyValueSyncResponse<T>>(msg, GET_KEY_VALUE_SYNC_RESPONSE);


export const createGetApiKeyRequest = (): GetApiKeyRequest => {
  return {
    action: GET_CHATGPT_API_KEY_REQUEST,
    data: undefined
  }
}

export const createGetApiKeyResponse = (text: string | undefined) : GetApiKeyResponse => {
  return {
    action: GET_CHATGPT_API_KEY_RESPONSE,
    data: { text }
  }
}

/**
 * set this to undefined to clear the key
 * */
export const createSetApiKeyRequest = (value: string | undefined): SetApiKeyRequest => {
  return {
    action: SET_CHATGPT_API_KEY_REQUEST,
    data: { value }
  }
}

/**
 * Request to set a key/value pair in storage.sync
 * @param key
 * @param value
 */
export const createSetKeyValueSyncRequest = <T>(key: string, value: T | undefined): SetKeyValueSyncRequest<T> => {
  return {
    action: SET_KEY_VALUE_SYNC_REQUEST,
    data: { key, value }
  }
}

/**
 * Request to get a key/value pair from storage.sync
 * @param key
 * @param value
 */
export const createGetKeyValueSyncRequest = (key: string): GetKeyValueSyncRequest => {
  return {
    action: GET_KEY_VALUE_SYNC_REQUEST,
    data: { key }
  }
}

/**
 * Response to get a key/value pair from storage.sync
 * @param key
 * @param value
 */
export const createGetKeyValueSyncResponse = <T>(key: string, value: T | undefined): GetKeyValueSyncResponse<T> => {
  return {
    action: GET_KEY_VALUE_SYNC_RESPONSE,
    data: { key, value }
  }
}
