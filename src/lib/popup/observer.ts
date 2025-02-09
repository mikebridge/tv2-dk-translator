// I can't seem to import from messages.ts, so in the meantime I am copying it here.
// const SUBTITLE_TRANSLATED = "subtitleTranslated";
// const SUBTITLE_ADDED_TO_DOM = "subtitleAddedToDOM";

// coming from backend

const TRANSLATION_RESPONSE = "translationResponse";
const TRANSLATION_REQUEST = "translationRequest";
// const SUBTITLE_ADDED_TO_DOM = "subtitleAddedToDOM";

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

export const isTransactionResponse = (msg: any): msg is TranslationResponse => {
  return msg && msg.action === TRANSLATION_RESPONSE;
}

const formatSubtitle = (text: string) => {
  // split the sentence into lines with a maximum of 40 chars per line
  const MAX_CHARS = 30
  const textWithLineBreaks = text.split('\n').map((line) => {
    const words = line.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
      if (currentLine.length + word.length + 1 < MAX_CHARS) {
        currentLine += word + ' ';
      } else {
        lines.push(currentLine);
        currentLine = word + ' ';
      }
    }
    lines.push(currentLine);
    return lines.join('<br />\n');
  })
  return textWithLineBreaks.join(' ');
  // return text.replace(/\n/g, '<br />');
}


const displayTranslatedElement = (translated: string) => {
  console.log('displaying translated text')
  const translatedAsHtml = formatSubtitle(translated);

  const el = document.querySelector<HTMLDivElement>('.theoplayer-ttml-texttrack-Dansk #translated');
  if (el) {
    console.log('found existing')
    console.log(translated);
    // put a br in where there's a newline
    el.innerHTML = translatedAsHtml
  } else {
    console.log('creating new element')
    // append the translation
    const origEl = document.querySelector('.theoplayer-ttml-texttrack-Dansk #r0');
    // clone it and append it as a sibling
    if (origEl) {
      const newEl = origEl.cloneNode(true) as Element;
      newEl.setAttribute('id', 'translated');
      newEl.textContent = translatedAsHtml;
      // append as a sibling to el
      console.log("APPENDING ELEMENT");
      origEl.parentElement?.appendChild(newEl);
    }
  }
}


const translationHandler = (response: unknown) => {
  console.log("translationHandler: Received translation from background script:");
  console.dir(response)
  // const subtitleElement = document.querySelector('.theoplayer-ttml-texttrack-Dansk #r0');
  //if (subtitleElement) {
    if (isTransactionResponse(response)) {
      displayTranslatedElement(response.data.text);
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
        return spanElement.innerText.trim();
      }
    }
  }
}

/**
 * Attach a listener that listens for new subtitles added to the dom
 */
export const connectToTextTrack = () => {
  let lastSubtitle = '';
  // find the element that is below .theoplayer-ttml-texttrack-Dansk and has an id of r0


  const observer = new MutationObserver((mutationsList) => {
    const subtitleElement = document.querySelector('.theoplayer-ttml-texttrack-Dansk #r0');
    if (subtitleElement) {
      mutationsList.forEach(async (mutation) => {
        // console.dir(mutation);
        const addedText = findAddedText(subtitleElement, mutation);

        if (addedText && lastSubtitle !== addedText) { // this is different from the last subtitle
          lastSubtitle = addedText;
          console.log("Sending For Translation:", addedText);
          const msg = createTranslationRequest(addedText);
          console.dir(msg)
          chrome.runtime.sendMessage(msg, translationHandler);
          // chrome.runtime.sendMessage(msg, (response) => {
          //   if (chrome.runtime.lastError) {
          //     console.error("Message sending error:", chrome.runtime.lastError);
          //     return;
          //   }
          //
          //   console.log("FAKE TRANSLATION LISTENER HEARS")
          //   console.dir(response)
          // });
        }
      });
    }
  });
  observer.observe(document.body, {childList: true, subtree: true});
}
