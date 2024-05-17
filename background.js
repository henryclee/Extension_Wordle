// background.js
console.log('HTML Reader Extension installed.');

let legalWords = Array();
let possibleAnswers = Array();
let guessrow = 0;

// Listen for the DOM content loaded event
chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
    // Check if the URL matches the specific website
    if (details.url.startsWith("https://www.nytimes.com/games/wordle/index.html")) {
        console.log('Wordle website loaded, loading dictionaries');
        // Your code here
        var fileURL = chrome.runtime.getURL('Dictionary/legalWords.txt');

        // Use fetch API to load the file
        fetch(fileURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load legalWords file');
                }
                return response.text();
                })
            .then(text => {
                // Parse the file contents into an array
                legalWords = text.split('\n');
                // Store the dictionary array in a variable or use it as needed
                console.log('legal Words array loaded');
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
                // Parse the file contents into an array
                possibleAnswers = text.split('\n');
                // Store the dictionary array in a variable or use it as needed
                console.log('Possible answers array loaded');
            })
            .catch(error => {
                console.error(error);
            });
    }
});

// Listen for messages from content scripts
// Filter the possible answers based on guesses
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'filter') {
        guesses = message.guesses;
        states = message.states;
        
        filterset = new Set();
        correct = Array(5).fill("");
        count = Array(26).fill(0);
        absent = new Set();
        a = 97;

        for (let r = guessrow; r < 6; r ++) {
            if (guesses[r][0] == "") {
                guessrow = r-1;
                break;
            }
            tempcount = Array(26).fill(0);
            for (let c = 0; c < 5; c ++) {
                switch (states[r][c]) {
                    case "a":
                        absent.add(guesses[r][c]);
                        break;
                    case "p":
                        ord = guess[r].charCodeAt(c) - a;
                        tempcount[ord] += 1;
                        break;
                    case "c":
                        ord = guess[r].charCodeAt(c) - a;
                        tempcount[ord] += 1;
                        correct[c] = guesses[r][c];
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

        for (let i = 0; i < possibleAnswers.length; i++ ) {
            
            

        }


    }
});