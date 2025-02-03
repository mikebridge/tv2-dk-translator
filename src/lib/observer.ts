
export const connectToTextTrack = () => {
  const parentElement = document.querySelector('.theoplayer-ttml-texttrack-Dansk');

  if (parentElement) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const newR0 = document.querySelector<HTMLDivElement>('#r0');
          if (newR0) {
            console.log('New Subtitle Element Detected:', newR0.innerText.trim());
          }
        }
      });
    });

    observer.observe(parentElement, {childList: true, subtree: true});

    console.log('Observing for changes to #r0...');
  } else {
    console.log('Parent container not found.');
  }
}
