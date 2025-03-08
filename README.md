# TV2.Dk Subtitle Translator

A chrome extension to translate Danish subtitles on play.tv2.dk on the fly via openai's API.

## Requirements

To use the extension, you will need an [openai api key](https://platform.openai.com/api-keys).

## Disclaimer

_This extension is not affiliated with TV2 or OpenAI. It is a personal project and should be used for 
educational purposes only._

## Setup

```sh
npm install
```

## Build

```sh
npm run build:watch
```

## Local Installation

Install the extension locally in Chrome:

- build the app into `/dist` via `npm run build`
- opening `chrome://extensions` in Chrome
- choose "Load unpacked" and select the `/dist` folder
