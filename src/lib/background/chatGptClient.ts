import {getOpenAiApiKeyFromLocalStorage} from "./storageListener";

const OPENAPI_BASEURL = 'https://api.openai.com/v1/chat/completions';

const getInstructions = (lang: string) => {
  return `Translate the following sets of auto-transcribed text to ${lang}, making it sound like natural spoken " +
      "language.  Please return the same number of lines in the translation as in the original.`
}

export const translateText = async (text: string, targetLanguage: string) => {
  const apiKey = await getOpenAiApiKeyFromLocalStorage();
  if (!apiKey) {
    console.warn("api key is not set, not calling api")
    return;
  }
  const body = JSON.stringify({
    model: 'gpt-4o',
    messages: [
      {role: 'system', content: getInstructions(targetLanguage)},
      {role: 'user', content: text}
    ],
    max_tokens: 500,
  });

  try {
    const response = await fetch(OPENAPI_BASEURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body,
    });

    const data = await response.json();
    // console.log("RETURNED FROM API")
    // console.log(data);
    // if this is an error, return the error message

    if (data.error) {
      return data.error.message;
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error during translation:', error);
  }
};
