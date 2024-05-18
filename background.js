// background.js
console.log('Wordle Hints Extension installed.');

let legalWords = Array();
let possibleAnswers = Array();
let guessrow = 0;

// Listen for the DOM content loaded event
chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
    // Check if the URL matches the specific website
    if (details.url.startsWith("https://www.nytimes.com/games/wordle/index.html")) {
        var fileURL = chrome.runtime.getURL('Dictionary/legalWords.txt');
        fetch(fileURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load legalWords file');
                }
                return response.text();
                })
            .then(text => {
                legalWords = text.split('\n');
            })
            .catch(error => {
                console.error(error);
            });

        fileURL = chrome.runtime.getURL('Dictionary/possibleAnswers.txt');

        fetch(fileURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load possibleAnswers file');
                }
                return response.text();
                })
            .then(text => {
                possibleAnswers = text.split('\n');
            })
            .catch(error => {
                console.error(error);
            });
    }
});

// Listen for messages from content scripts
// Filter the possible answers based on guesses
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // FILTER PossibleAnswers
    if (message.action === 'filter') {

        guesses = message.guesses;
        states = message.states;
        
        filterout = new Set();
        correct = Array(5).fill("");
        count = Array(26).fill(0);
        absent = new Set();
        a = 97;

        for (let r = guessrow; r < 6; r ++) {
            if (states[r][0] == "e") {
                guessrow = r-1;
                if (guessrow < 0) {
                    guessrow = 0;
                }
                break;
            }
            tempcount = Array(26).fill(0);
            for (let c = 0; c < 5; c ++) {
                ord = guesses[r][c].charCodeAt(0) - a;
                switch (states[r][c]) {
                    case "a":
                        if (count[ord] == 0 && tempcount[ord] == 0) {
                            absent.add(guesses[r][c]);
                        }                        
                        break;
                    case "p":
                        tempcount[ord] += 1;
                        break;
                    case "c":
                        tempcount[ord] += 1;
                        correct[c] = guesses[r][c];
                        break;
                    default:
                        console.log("error in states");                    
                }
            }
            for (let i = 0; i < 26; i ++) {
                if (count[i] < tempcount[i]) {
                    count[i] = tempcount[i];
                }
            }
        }

        for (let a of absent) {
            console.log(a);
        }

        for (let i = 0; i < possibleAnswers.length; i++ ) {

            tempcount = Array(26).fill(0);
            exclude = false;           
            
            for (let c = 0; c < 5; c ++) {
                letter = possibleAnswers[i][c];
                ord = letter.charCodeAt(0) - a;
                if (correct[c] != "" &&  correct[c] != letter) {
                    exclude = true;
                    break;
                } else if (absent.has(letter)) {
                    exclude = true;
                    break;
                }
                tempcount[ord] += 1;
            }
            if (!exclude) {
                for (let c = 0; c < 26; c ++) {
                    if (count[c] > tempcount[c]) {
                        exclude = true;
                        break;
                    }
                }
            }
            if (exclude) {
                filterout.add(i)
            }
        }
        
        possibleAnswers = possibleAnswers.filter((_, index) => !filterout.has(index));
        if (possibleAnswers.length < 5) {
            console.log(possibleAnswers)
        }
        sendResponse({possibleAnswers: possibleAnswers, legalWords: legalWords});
    }
    return true;
});