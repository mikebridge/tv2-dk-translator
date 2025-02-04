import { createTranslatedMessage } from "./lib/messages";

// export const isSubtitleUpdated = (msg: any): msg is SubtitleUpdated => {
//   return msg.action === SUBTITLE_UPDATED;
// }

// TODO: Don't hardcode this!!!
// const openaiApiKey = ''; // Replace with your OpenAI API key
// const endpoint = 'https://api.openai.com/v1/chat/completions';
const chatGptDisabled = true

// need to use a promise, not use async
const translateText = (text: string, targetLanguage: string) => {
    if (chatGptDisabled) {
        return Promise.resolve(targetLanguage + ': ' + text);
    }


    // const body = JSON.stringify({
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //         { role: 'system', content: 'You are a helpful assistant that translates text into different languages.' },
    //         { role: 'user', content: `Translate the following text into ${targetLanguage}: ${text}` }
    //     ],
    //     max_tokens: 500,
    // });
    //
    // try {
    //     const response = await fetch(endpoint, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${openaiApiKey}`,
    //         },
    //         body,
    //     });
    //
    //     const data = await response.json();
    //     console.log("RETURNED FROM API")
    //     console.log(data);
    //     // if this is an error, return the error message
    //     if (data.error) {
    //         return data.error.message;
    //     }
    //     return data.choices[0].message.content;
    //     // console.log(`Translated text: ${translatedText}`);
    // } catch (error) {
    //     console.error('Error during translation:', error);
    // }
};

// Example usage
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  //if (isSubtitleUpdated(message)) {
    try {
        (async () => {
            const translatedText = await translateText(message.data.text, 'en') || 'unknown';
            const response = createTranslatedMessage(translatedText);
            console.log("SENDING RESPONSE");
            console.dir(response);
            sendResponse(response);
        })();


    }
    catch(error) {
        console.error('ignoring error', error)
    }
    // send to chatgpt to translate



    //   fetch("https://your-backend.com/api/receive", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(message.data)
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log("Response from backend:", data);
    //       sendResponse({ success: true, data });
    //     })
    //     .catch(error => {
    //       console.error("Error communicating with backend:", error);
    //       sendResponse({ success: false, error });
    //     });
    return true; // Required to use sendResponse asynchronously
  //}
});

console.log("✅ Background script loaded...");
