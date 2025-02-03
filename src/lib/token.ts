// TODO: maybe we can use chrome.identity.getAuthToken() for chatgpt


export const setToken = () => {
  chrome.storage.local.set({apiKey: "YOUR_SECRET_API_KEY"}, () => {
    console.log("API Key saved securely.");
  });
};

export const getToken = () => {
  chrome.storage.local.get("apiKey", (data) => {
    console.log("Retrieved API Key:", data.apiKey);
  });
}
