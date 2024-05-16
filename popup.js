document.addEventListener('DOMContentLoaded', () => {
  const readHtmlButton = document.getElementById('read-html');
  if (readHtmlButton) {
    readHtmlButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getHTML" }, (response) => {
          if (response && response.html) {
            document.getElementById('output').textContent = response.html;
          } else {
            document.getElementById('output').textContent = "No HTML content retrieved.";
          }
        });
      });
    });
  }
});
