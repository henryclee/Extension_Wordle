document.addEventListener('DOMContentLoaded', () => {
  const readHtmlButton = document.getElementById('get-hint');
  if (readHtmlButton) {
    readHtmlButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

        chrome.tabs.sendMessage(tabs[0].id, { action: "hint" }, (response) => {
          if (response && response.bestguess) {
            document.getElementById('output').textContent = response.bestguess + "\n" + response.possible;
          } else {
            document.getElementById('output').textContent = "No Clue found";
          }
        });
      });
    });
  }
});
