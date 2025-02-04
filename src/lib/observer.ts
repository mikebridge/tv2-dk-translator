// I can't seem to import from messages.ts, so in the meantime I am copying it here.
const SUBTITLE_TRANSLATED = "subtitleTranslated";
const SUBTITLE_UPDATED = "subtitleUpdated";

export interface SubtitleTranslated {
  action: "subtitleTranslated",
  data: { text: string }
}

export interface SubtitleUpdated {
  action: "subtitleUpdated",
  data: { text: string }
}

export const createUpdatedMessage = (text: string): SubtitleUpdated => ({
  action: SUBTITLE_UPDATED,
  data: {text}
})

export const isSubtitleTranslated = (msg: any): msg is SubtitleTranslated => {
  return msg.action === SUBTITLE_TRANSLATED;
}

const displayTranslatedElement = (translated: string) => {
  console.log('displahying trandlated element')
  const el = document.querySelector<HTMLDivElement>('.theoplayer-ttml-texttrack-Dansk #translated');
  if (el) {
    console.log('found existing')
    console.log(translated);
    // put a br in where there's a newline
    el.innerHTML = translated.replace(/\n/g, '<br>');
  } else {
    console.log('creating new element')
    // append the translation
    const origEl = document.querySelector('.theoplayer-ttml-texttrack-Dansk #r0');
    // clone it and append it as a sibling
    if (origEl) {
      const newEl = origEl.cloneNode(true) as Element;
      newEl.setAttribute('id', 'translated');
      newEl.textContent = translated;
      // append as a sibling to el
      console.log("APPENDING ELEMENT");
      origEl.parentElement?.appendChild(newEl);
    }
  }
}


const translationHandler = (response: SubtitleTranslated) => {
  console.log("Response from background script:");
  console.dir(response)
  // const subtitleElement = document.querySelector('.theoplayer-ttml-texttrack-Dansk #r0');
  //if (subtitleElement) {
    if (isSubtitleTranslated(response)) {
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
          console.log("Text content:", addedText);
          const msg = createUpdatedMessage(addedText);
          chrome.runtime.sendMessage(msg, translationHandler);
        }
      });
    }
  });
  observer.observe(document.body, {childList: true, subtree: true});
}
