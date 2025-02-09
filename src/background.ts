import {isTranslationRequest, createTranslationResponse} from "./lib/common/messages";
import {translateText} from "./lib/background/chatGptClient";
import {EXTENSION_NAME} from "./lib/common/constants";
import {initializeStorageListener} from "./lib/background/storageListener";

initializeStorageListener();

// NOTE: the callback cannot be marked as async.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    // console.log("Main Listener LISTENER HEARS")
    console.dir(message)
    try {
        if (isTranslationRequest(message)) {
            console.log("background: TRANSLATION LISTENER RECEIVED TRANSLATION REQUEST");
            console.log(message);
            const original = message.data.text;

            translateText(original, 'en').then((translatedText) => {
                const response = createTranslationResponse(translatedText || undefined, original);
                console.log("background: TRANSLATION LISTENER SENDING TRANSLATION!");
                console.dir(response);
                sendResponse(response);
                console.log('(returning true)')
            });
            return true;
        }
    } catch (error) {
        console.error('ignoring error', error);
        return true;
    }
    return false;
});

console.log(`✅ ${EXTENSION_NAME}: Background script loaded...`);
