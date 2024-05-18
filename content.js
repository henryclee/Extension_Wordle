chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "hint") {

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
                if (tiles[0].getAttribute('data-state') == "empty") {
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

        function findEntropy(guess, possibleAnswers) {
            histo = {}
            entropy = 0;
            denom = possibleAnswers.length
            for (let answer of possibleAnswers) {
                pattern = findPattern(guess, answer);
                if (pattern == "ccccc") {
                    entropy = .000001
                }
                histo[pattern] = (histo[pattern] ?? 0) + 1;
                
            }
            for (let count of Object.values(histo)) {
                entropy += count*Math.log2(denom/count);
            }
            return entropy
        }

        let [g, s] = getGuesses();

        chrome.runtime.sendMessage({ action: 'filter', guesses: g, states: s }, (response) => {
            
            possibleAnswers = response.possibleAnswers;
            legalWords = response.legalWords;

            if (s[0][0] == "e"){
                sendResponse({ 
                    bestguess: "First guess: trace or tares",
                    possible: possibleAnswers.length.toString() + " possible answers",
                });
                return true;
            }

            if (possibleAnswers.length == 2) {
                sendResponse({
                    bestguess: "50/50 Chance, try your luck",
                    possible: "Possible answers: " + possibleAnswers.toString()
                })
                return true;
            }

            highestentropy = 0;
            bestguess = "";
            
            for (let guess of legalWords) {
                entropy = findEntropy(guess, possibleAnswers);
                if (entropy > highestentropy) {
                    highestentropy = entropy;
                    bestguess = guess;
                }
            }

            possResponse = possibleAnswers.length.toString() + " possible answers";
            if (possibleAnswers.length <= 10) {
                possResponse = "Possible answers: " + possibleAnswers.slice(0,10).toString();
            }

            guessResponse = bestguess;
            if (possibleAnswers.length == 1) {
                guessResponse = "The answer is " + bestguess;
                possResponse = "Possible answers: 1";
            }

            sendResponse({ 
                bestguess: bestguess,
                possible: possResponse
            });
        });
        return true;
    }
  });
  