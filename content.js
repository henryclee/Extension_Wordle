chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getHTML") {
        console.log("getHTML request received");

        // rowDivs = document.querySelectorAll('div.Row-module_row__pwpBq');
        // rowDivs.forEach(rowdiv => {

        //     tiles = rowdiv.querySelectorAll('div[aria-roledescription="tile"]');
        //     tiles.forEach(tilediv => {
        //         arialabel = tilediv.getAttribute('aria-label');
        //         text = tilediv.textContent;
        //         stat = tilediv.getAttribute('data-state')
        //         console.log(arialabel);
        //         console.log(text, stat);
        //     })
            
        // })

        function getGuesses() {

            guesses = Array(6);
            states = Array(6);

            for (let r = 0; r < 6; r++) {
                guesses[r] = Array(5).fill("");
                states[r] = Array(5).fill("e");
            }

            rowDivs = document.querySelectorAll('div.Row-module_row__pwpBq');

            for (let r = 0; r < 6; r++ ) {
                tiles = rowDivs[r].querySelectorAll('div[aria-roledescription="tile"]');
                if (tiles[c].getAttribute('data-state') == "empty") {
                    break;
                } 
                for (let c = 0; c < 5; c++) {
                    letter = tiles[c].textContent;
                    state = tiles[c].getAttribute('data-state');
                    guesses[r][c] = letter;
                    states[r][c] = state[0]; // first letter of absent, present, or correct
                }
            } 

            return [guesses, states]
            
        }

        function findPattern(guess, answer) {
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

        let [g, s] = getGuesses();
        console.log(g);
        console.log(s);

        sendResponse({ html: document.documentElement.innerHTML });
    }
  });
  