import { createTranslatedMessage } from "./lib/messages";

// export const isSubtitleUpdated = (msg: any): msg is SubtitleUpdated => {
//   return msg.action === SUBTITLE_UPDATED;
// }

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  //if (isSubtitleUpdated(message)) {
    console.log("BACKEND HEARS: ")
    console.log(message);
    const response = createTranslatedMessage(`TODO: Translate ${message.data.text}`);

    sendResponse(response);

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
