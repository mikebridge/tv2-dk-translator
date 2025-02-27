/* =============== START IMPORT WORKAROUNDS  ====================== */

// import { getValueFromSyncStorage } from "../background/storageListener";
// export const getValueFromSyncStorage = (key: string) => new Promise<string | undefined>((resolve) => {
//   chrome.storage.sync.get(key, (response) => {
//     resolve(response[key]);
//   });
// });

const CLEAR_TRANSLATION_TIMEOUT_MS = 5000;

/* COPIED FROM events.ts **/
const TRANSLATION_RESPONSE = "translationResponse";
const TRANSLATION_REQUEST = "translationRequest";
const CLEAR_TRANSLATION_REQUEST = "clearTranslationRequest";



/* COPIED FROM messages.ts */

interface TranslationRequestData {
  text: string
  currentTime: number
}

export interface TranslationRequest {
  action: typeof TRANSLATION_REQUEST,
  data: TranslationRequestData
}

interface ClearTranslationRequestData {
  currentTime: number
}

export interface ClearTranslationRequest {
  action: typeof CLEAR_TRANSLATION_REQUEST,
  data: ClearTranslationRequestData
}

interface TranslationResponseData {
  text: string
  original: string
  currentTime: number
}

export interface TranslationResponse {
  action: typeof TRANSLATION_RESPONSE,
  data: TranslationResponseData
}

export const createTranslationRequest = (text: string, currentTime: number): TranslationRequest => ({
  action: TRANSLATION_REQUEST,
  data: {
    text,
    currentTime
  }
})

export const createClearTranslationRequest = (currentTime: number): ClearTranslationRequest => ({
  action: CLEAR_TRANSLATION_REQUEST,
  data: {
    currentTime,
  }
})

export const isTranslationResponse = (msg: unknown): msg is TranslationResponse => {
  // return msg && msg.action === TRANSLATION_RESPONSE;
  return !!msg && typeof msg === 'object' && 'action' in msg && msg['action'] === TRANSLATION_RESPONSE;
}

export const isClearTranslationRequest = (msg: unknown): msg is ClearTranslationRequest => {
  return !!msg && typeof msg === 'object' && 'action' in msg && msg['action'] === CLEAR_TRANSLATION_REQUEST;
}

/* =============== END IMPORT WORKAROUNDS  ====================== */

const formatSubtitle = (text: string) => {
  // split the sentence into lines with a maximum of 40 chars per line
  // const MAX_CHARS = 30
  // const textWithLineBreaks = text.split('\n').map((line) => {
  //   const words = line.split(' ');
  //   const lines = [];
  //   let currentLine = '';
  //   for (const word of words) {
  //     if (currentLine.length + word.length + 1 < MAX_CHARS) {
  //       currentLine += word + ' ';
  //     } else {
  //       lines.push(currentLine);
  //       currentLine = word + ' ';
  //     }
  //   }
  //   lines.push(currentLine);
    // substitute the line breaks  in text with a br
    return text?.replace(/\n/g, ' <br />\n');
    //return lines.join('<br />\n');

  //return textWithLineBreaks.join(' ');
  // return text.replace(/\n/g, '<br />');
}

// create an html element based on this
// TODO: let's move the stuff from .css to here so that it can be controlled programmatically.
const createDualSubtitlesHTML = (translated: string, original: string) => {
  const html = `
        <div classname="x-theoplayer-ttml-texttrack-Dual">
          <div id="english">
            <p style="font-family: inherit; color: inherit; text-align: center; padding: 0px; margin: 0px; line-height: inherit;">
            <span style="color: rgb(255, 255, 0); padding-right: 0.5em; padding-left: 0.5em;">
<!--              <span style="color: rgb(255, 255, 0); background-color: rgba(0, 0, 0, 0.25); padding-right: 0.5em; padding-left: 0.5em;">-->
                ${translated}
              </span>
            </p>
          </div>
          <div id="danish">
            <p style="font-family: inherit; color: inherit; text-align: center; padding: 0px; margin: 0px; line-height: inherit;">
              <span style="color: rgb(255, 255, 255); padding-right: 0.5em; padding-left: 0.5em;">

<!--              <span style="color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0.25); padding-right: 0.5em; padding-left: 0.5em;">-->
                ${original}
              </span style="color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0.25); padding-right: 0.5em; padding-left: 0.5em;">
            </p>
          </div>
        </div>
    `;
  return html;
}

/**
 * Display the translated element on the page
 * @param translated
 * @param original
 */
const displayTranslatedElement = (translated: string, original: string, randomId: string) =>  {
  const translatedAsHtml = formatSubtitle(translated);
  const originalAsHtml = formatSubtitle(original);

  const textTracksContainer = document.querySelector('.theoplayer-texttracks');

  if (textTracksContainer) {
    // Generate the HTML using the template function
    const subtitlesHTML = createDualSubtitlesHTML(translatedAsHtml, originalAsHtml);

    // Replace the content of the theoplayer-texttracks element
    textTracksContainer.innerHTML = `<div id="dual-subtitles-container" data-id="${randomId}">${subtitlesHTML}</div>`;
    return randomId;
  } else {
    console.error("Could not find .theoplayer-texttracks element");
  }
}

/**
 * clear the translated element
 * @param randomId
 * @param timeoutMs
 */
const clearAfter = (randomId: string, timeoutMs: number) => {
  setTimeout(() => {
    const container = document.querySelector(`#dual-subtitles-container[data-id="${randomId}"]`);
    if (container) {
      console.log(`clearing container ${randomId} after timeout`);
      container.innerHTML = '';
    }
  }, timeoutMs);
}

const translationHandler = (response: unknown) => {
  console.log("translationHandler: Received translation from background script:");
  console.dir(response)

  if (isTranslationResponse(response)) {
    const randomId = Math.random().toString(36).substring(7);
    displayTranslatedElement(response.data.text, response.data.original, randomId);
    clearAfter(randomId, CLEAR_TRANSLATION_TIMEOUT_MS)
  }

}

const findAddedText = (el: Element, mutation: MutationRecord) => {
  console.log('mutation.type=', mutation.type);
  if (mutation.type === 'childList') {
    if (mutation.addedNodes.length > 0) { // we're adding something.
      // find the span element that doesn't have the data-translated attribute

      const spanElement = el.querySelector('span');
      if (spanElement) {
        // return spanElement.innerText.trim();
        const htmlContent = spanElement.innerHTML;
        const textWithNewlines = htmlContent.replace(/<br\s*\/?>/gi, '\n');
        return textWithNewlines.trim();

      }
    }
  }
}

export const toggleOriginalSubtitleVisibility = (show: boolean): void => {
  // Find all elements with id "r0" that are descendants of elements with class "theoplayer-texttracks"
  const r0Elements = document.querySelectorAll('.theoplayer-texttracks #r0');

  r0Elements.forEach(element => {
    // Set the display style based on the 'show' parameter
    (element as HTMLElement).style.display = show ? 'flex' : 'none'; // Or 'block' depending on the original display
  });
};

const getCurrentTime = () => {
  const player = document.querySelector('video') as HTMLVideoElement;
  return player?.currentTime;
}

const storageCache: Record<string, unknown> = {};

/**
 * This seems async.  So let's store them locally
 */
export const watchSyncStorage = () => {
  // initialize the cache
  chrome.storage.sync.get(null, (items) => {
    Object.assign(storageCache, items);
  });
  // watch for changes
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      for (const [key, { newValue }] of Object.entries(changes)) {
        storageCache[key] = newValue;
      }
    }
  });
}

/**
 * Attach a listener that listens for new subtitles added to the dom
 */
export const connectToTextTrack = () => {
  let lastSubtitle = '';
  // find the element that is below .theoplayer-ttml-texttrack-Dansk and has an id of r0

  const observer = new MutationObserver(  (mutationsList) => {

    if (storageCache['active'] === false) { // undefined is true
      return;
    }

    // sometimes this is .theoplayer-ttml-texttrack- and sometimes .theoplayer-ttml-texttrack-Dansk

    const subtitleElement = document.querySelector('[class^="theoplayer-ttml-texttrack"] #r0');
    //const subtitleElement = document.querySelector('.theoplayer-ttml-texttrack-Dansk #r0');
    if (subtitleElement) {
      // TODO: extract this
      // hide the element
      const originalStyle = subtitleElement.getAttribute('style');

      // Modify the display property
      let newStyle = originalStyle;
      if (newStyle?.includes('display: flex')) {
        newStyle = newStyle.replace('display: flex', 'display: none');
        subtitleElement.setAttribute('style', newStyle);
      }

      // now translate it
      mutationsList.forEach(async (mutation) => {
        // console.dir(mutation);
        const addedText = findAddedText(subtitleElement, mutation);

        if (addedText) {
          if (lastSubtitle !== addedText) { // this is different from the last subtitle
            lastSubtitle = addedText;
            console.log("Sending For Translation:", addedText);
            const msg = createTranslationRequest(addedText, getCurrentTime());
            console.dir(msg)
            chrome.runtime.sendMessage(msg, translationHandler);
          } else {
            console.log('ignoring duplicate');
          }
        } else {
          // do we need to remove duplicate "clear" messages?
          console.log('text is empty...')
          chrome.runtime.sendMessage(createClearTranslationRequest(getCurrentTime())).catch(console.error)
          // todo: need to add a timeout for this...
          // clearTranslatedElement();
        }
      });

    }
  });
  observer.observe(document.body, {childList: true, subtree: true});
}
