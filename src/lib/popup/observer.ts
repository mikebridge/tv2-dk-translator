// THe common files are being excluded from the bundle for some reason.
// until I can figure that out, they are copied here.
// import {TRANSLATION_REQUEST, TRANSLATION_RESPONSE} from "../common/events";
//import {TRANSLATION_REQUEST, TRANSLATION_RESPONSE} from "../common/events";

//import { createTranslationRequest, isTranslationResponse } from "../common/messages";

//console.log("FOUND " + tmp);
/* =============== START IMPORT WORKAROUNDS  ====================== */

/* COPIED FROM events.ts **/
const TRANSLATION_RESPONSE = "translationResponse";
const TRANSLATION_REQUEST = "translationRequest";

/* COPIED FROM messages.ts */

interface TranslationRequestData {
  text: string
}

export interface TranslationRequest {
  action: typeof TRANSLATION_REQUEST,
  data: TranslationRequestData
}

interface TranslationResponseData {
  text: string
  original: string
}

export interface TranslationResponse {
  action: typeof TRANSLATION_RESPONSE,
  data: TranslationResponseData
}

export const createTranslationRequest = (text: string): TranslationRequest => ({
  action: TRANSLATION_REQUEST,
  data: {
    text,
  }
})

export const isTranslationResponse = (msg: any): msg is TranslationResponse => {
  return msg && msg.action === TRANSLATION_RESPONSE;
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
const createDualSubtitlesHTML = (translated: string, original: string) => {
  const html = `
        <div classname="theoplayer-ttml-texttrack-Dual">
          <div id="english">
            <p style="font-family: inherit; color: inherit; text-align: center; padding: 0px; margin: 0px; line-height: inherit;">
              <span style="color: rgb(255, 255, 0); background-color: rgba(0, 0, 0, 0.25); padding-right: 0.5em; padding-left: 0.5em;">
                ${translated}
              </span>
            </p>
          </div>
          <div id="danish">
            <p style="font-family: inherit; color: inherit; text-align: center; padding: 0px; margin: 0px; line-height: inherit;">
              <span style="color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0.25); padding-right: 0.5em; padding-left: 0.5em;">
                ${original}
              </span>
            </p>
          </div>
        </div>
    `;
  return html;
}

const displayTranslatedElement = (translated: string, original: string) =>  {
  const translatedAsHtml = formatSubtitle(translated);
  const originalAsHtml = formatSubtitle(original);

  const textTracksContainer = document.querySelector('.theoplayer-texttracks');

  if (textTracksContainer) {
    // Generate the HTML using the template function
    const subtitlesHTML = createDualSubtitlesHTML(translatedAsHtml, originalAsHtml);

    // Replace the content of the theoplayer-texttracks element
    textTracksContainer.innerHTML = `<div id="dual-subtitles-container">${subtitlesHTML}</div>`;

  } else {
    console.error("Could not find .theoplayer-texttracks element");
  }
}

const translationHandler = (response: unknown) => {
  console.log("translationHandler: Received translation from background script:");
  console.dir(response)
  // const subtitleElement = document.querySelector('.theoplayer-ttml-texttrack-Dansk #r0');
  //if (subtitleElement) {
    if (isTranslationResponse(response)) {
      displayTranslatedElement(response.data.text, response.data.original);
      // replace the text content of the subtitle element with the new text
      // add an attribute to the span element to indicate that it has been translated
      //const spanElement = subtitleElement.querySelector('span');
      // if (spanElement) {
      //   spanElement.setAttribute('data-translated', 'true');
      //   spanElement.innerText = response.data.text;
      // }
    }
  //}

}

const findAddedText = (el: Element, mutation: MutationRecord) => {
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



/**
 * Attach a listener that listens for new subtitles added to the dom
 */
export const connectToTextTrack = () => {
  let lastSubtitle = '';
  // find the element that is below .theoplayer-ttml-texttrack-Dansk and has an id of r0


  const observer = new MutationObserver((mutationsList) => {
    const subtitleElement = document.querySelector('.theoplayer-ttml-texttrack-Dansk #r0');
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

        if (addedText && lastSubtitle !== addedText) { // this is different from the last subtitle
          lastSubtitle = addedText;
          console.log("Sending For Translation:", addedText);
          const msg = createTranslationRequest(addedText);
          console.dir(msg)
          chrome.runtime.sendMessage(msg, translationHandler);
        }
      });

    }
  });
  observer.observe(document.body, {childList: true, subtree: true});
}
