import {watchSyncStorage, connectToTextTrack} from "./lib/popup/observer";
import "./content.css";

watchSyncStorage();

connectToTextTrack();

const injectCSS = (file: string) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL(file); // Ensure correct path

  if (document.head) {
    document.head.appendChild(link);
  } else {
    console.error('could not append to document head')
  }
}

injectCSS('assets/content.css');

console.log("✅ Content script loaded...");
