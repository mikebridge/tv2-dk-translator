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

export const createTranslatedMessage = (text: string): SubtitleTranslated => ({
  action: SUBTITLE_TRANSLATED,
  data: {text}
})


export const createUpdatedMessage = (text: string): SubtitleUpdated => ({
  action: SUBTITLE_UPDATED,
  data: {text}
})

export const isSubtitleTranslated = (msg: any): msg is SubtitleTranslated => {
  return msg.action === SUBTITLE_TRANSLATED;
}
