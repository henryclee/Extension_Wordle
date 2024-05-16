chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getHTML") {
        console.log("getHTML request received");

        rowDivs = document.querySelectorAll('div.Row-module_row__pwpBq');
        rowDivs.forEach(rowdiv => {

            tiles = rowdiv.querySelectorAll('div[aria-roledescription="tile"]');
            tiles.forEach(tilediv => {
                arialabel = tilediv.getAttribute('aria-label');
                text = tilediv.textContent;
                stat = tilediv.getAttribute('data-state')
                console.log(arialabel);
                console.log(text, stat);
            })
            
        })

        function filter() {
            
        }

        function findpattern(guess, answer) {
            const a = 97;
            counts = Array(26).fill(0);
            for (let i = 0; i < 5; i ++) {
                ord = answer.charCodeAt(i) - a;
                counts[ord] += 1;
            }
            pattern = Array(5).fill('a');
            for (let i = 0; i < 5; i ++) {
                ord = guess.charCodeAt(i) - a;
                if (guess[i] == answer[i]) {
                    pattern[i] = 'c';
                    counts[ord] -= 1;
                } else if (counts[ord] > 0) {
                    pattern[i] = 'p';
                    counts[ord] -= 1;
                }
            }
            return pattern.join("")
        }


        sendResponse({ html: document.documentElement.innerHTML });
    }
  });
  