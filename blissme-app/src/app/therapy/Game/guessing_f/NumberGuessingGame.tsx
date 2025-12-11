import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = "http://127.0.0.1:8000";

export default function NumberGuessingGame() {
  const [feedback, setFeedback] = useState<string>(
    'Click "New Game" to start!'
  );
  const [guess, setGuess] = useState<number | "">("");
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const setInputsDisabled = (disabled: boolean) => {
    if (inputRef) inputRef.disabled = disabled;
  };

  const startNewGame = async () => {
    try {
      const response = await fetch(`${API_URL}/start`, { method: "POST" });
      const data = await response.json();
      setFeedback(data.message);
      setGuess("");
      setGameActive(true);
      setInputsDisabled(false);
      inputRef?.focus();
    } catch (error) {
      console.error("Failed to start new game:", error);
      setFeedback("Error: Could not connect to the game server.");
    }
  };

  const handleGuess = async () => {
    if (guess === "") {
      setFeedback("Please enter a number.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess: Number(guess) }),
      });
      const data = await response.json();
      setFeedback(data.message);

      if (data.message.includes("Correct")) {
        setGameActive(false);
        setInputsDisabled(true);
      }
      setGuess("");
      inputRef?.focus();
    } catch (error) {
      console.error("Failed to handle guess:", error);
      setFeedback("Error: Failed to submit guess.");
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Enter" && gameActive) {
        handleGuess();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [gameActive, guess]);

  return (
    <div className="relative">
      <button
        onClick={() => navigate("/chat-new/text")}
        className="
          fixed top-4 right-8 z-50 
          bg-white/10 backdrop-blur-md border border-white/20
          text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg
          hover:bg-white/20 hover:scale-105 transition-transform duration-200
        "
      >
        ← Back to Chat
      </button>

      <div
        className="
        font-poppins text-center w-[90%] max-w-[400px] 
        bg-white/10 p-10 rounded-2xl 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] 
        backdrop-blur-md border border-white/20
      "
      >
        <h1 className="mt-0 font-semibold text-2xl">Guess the Number!</h1>
        <p className="min-h-[24px] my-5 text-lg font-semibold">{feedback}</p>

        <div className="flex gap-2 mb-5">
          <input
            type="number"
            placeholder="Enter your guess"
            min={1}
            max={100}
            value={guess}
            onChange={(e) =>
              setGuess(e.target.value === "" ? "" : Number(e.target.value))
            }
            disabled={!gameActive}
            ref={setInputRef}
            className="
            flex-grow px-3 py-3 rounded-lg text-base outline-none
            bg-[rgba(98,92,92,0.2)] text-white 
            placeholder-white/70
          "
          />
          <button
            onClick={handleGuess}
            disabled={!gameActive}
            className="
            px-5 py-3 rounded-lg text-base font-semibold cursor-pointer
            transition-transform duration-200 ease-in-out
            bg-[#d86f13] text-white font-poppins
            hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]
            disabled:bg-[#555] disabled:cursor-not-allowed disabled:opacity-60
          "
          >
            Guess
          </button>
        </div>

        <button
          onClick={startNewGame}
          className="
          w-full px-5 py-3 rounded-lg text-base font-semibold cursor-pointer
          transition-transform duration-200 ease-in-out
          bg-[#a72b2b] text-white font-poppins
          hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]
          disabled:bg-[#555] disabled:cursor-not-allowed disabled:opacity-60
        "
        >
          New Game
        </button>
      </div>
    </div>
  );
}
