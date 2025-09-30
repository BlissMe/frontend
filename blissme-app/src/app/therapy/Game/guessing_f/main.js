"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Define the API endpoint
const API_URL = 'http://127.0.0.1:000';
// Get references to HTML elements and assert their types
const feedbackText = document.getElementById('feedback-text');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const newGameButton = document.getElementById('new-game-button');
/**
 * Toggles the state of input elements.
 * @param {boolean} disabled - Whether the elements should be disabled.
 */
function setInputsDisabled(disabled) {
    guessInput.disabled = disabled;
    guessButton.disabled = disabled;
}
/**
 * Starts a new game by calling the backend API.
 */
async function startNewGame() {
    try {
        const response = await fetch(`${API_URL}/start`, { method: 'POST' });
        const data = await response.json();
        feedbackText.textContent = data.message;
        guessInput.value = ''; // Clear previous guess
        setInputsDisabled(false); // Enable inputs for the new game
        guessInput.focus();
    }
    catch (error) {
        feedbackText.textContent = 'Error: Could not connect to the game server.';
        console.error('Failed to start new game:', error);
    }
}
/**
 * Handles the submission of a guess.
 */
async function handleGuess() {
    const guessValue = guessInput.value;
    if (!guessValue) {
        feedbackText.textContent = 'Please enter a number.';
        return;
    }
    try {
        const response = await fetch(`${API_URL}/guess`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guess: parseInt(guessValue, 10) }),
        });
        const data = await response.json();
        feedbackText.textContent = data.message;
        // If the guess was correct, disable the inputs
        if (data.message.includes('Correct')) {
            setInputsDisabled(true);
        }
        guessInput.value = ''; // Clear input after guess
        guessInput.focus();
    }
    catch (error) {
        feedbackText.textContent = 'Error: Failed to submit guess.';
        console.error('Failed to handle guess:', error);
    }
}
// Add event listeners to buttons
newGameButton.addEventListener('click', startNewGame);
guessButton.addEventListener('click', handleGuess);
// Allow pressing 'Enter' to submit a guess
guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleGuess();
    }
});
//# sourceMappingURL=main.js.map