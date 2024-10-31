const words = ["electron", "node", "javascript", "html", "css", "backend", "frontend"];
let selectedWord = "";
let displayedWord = [];
let errors = 0;
const maxErrors = 10;

function startGame() {
    errors = 0;
    document.getElementById("errors").textContent = errors;
    document.getElementById("message").textContent = "";

    selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    displayedWord = Array(selectedWord.length).fill("_");

    updateDisplayedWord();

    document.querySelectorAll(".letters button").forEach(button => button.disabled = false);
}

function updateDisplayedWord() {
    const wordContainer = document.getElementById("wordContainer");
    wordContainer.innerHTML = "";
    displayedWord.forEach(letter => {
        const span = document.createElement("span");
        span.textContent = letter;
        wordContainer.appendChild(span);
    });
}

function guess(letter) {
    const button = document.querySelector(`.letters button[onclick="guess('${letter}')"]`);
    if (button) button.disabled = true;

    if (selectedWord.includes(letter)) {
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === letter) {
                displayedWord[i] = letter;
            }
        }
        updateDisplayedWord();

        if (!displayedWord.includes("_")) {
            document.getElementById("message").textContent = "Bravo ! Tu as gagné !";
            window.electronAPI.win();
            disableAllButtons();
        }
    } else {
        errors++;
        document.getElementById("errors").textContent = errors;

        if (errors >= maxErrors) {
            document.getElementById("message").textContent = `Dommage ! Le mot était ${selectedWord}.`;
            window.electronAPI.lose();
            disableAllButtons();
        }
    }
}


function disableAllButtons() {
    document.querySelectorAll(".letters button").forEach(button => button.disabled = true);
}

function saveGame() {
    const gameData = {
        selectedWord,
        displayedWord,
        errors
    };
    window.electronAPI.save(gameData);
}

function loadGame() {
    window.electronAPI.load().then((gameData) => {
        if (gameData) {
            selectedWord = gameData.selectedWord;
            displayedWord = gameData.displayedWord;
            errors = gameData.errors;
            updateDisplayedWord();
            document.getElementById("errors").textContent = errors;
        } else {
            alert("Aucune partie sauvegardée trouvée.");
        }
    });
}

document.getElementById('saveBtn').addEventListener('click', () => {
    const gameData = {
        word: selectedWord,
        attempts: attempts,
        guessedLetters: guessedLetters
    };
    window.electronAPI.saveGame(gameData);
});

window.electronAPI.onSaveSuccess((message) => {
    alert(message);
});

window.electronAPI.onSaveFailure((message) => {
    alert(message);
});

startGame();
