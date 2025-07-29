import { useState } from "react";
import { Button } from "antd";
import logo from "../../assets/images/logo.png";
import heart from "../../assets/images/heart.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNotification } from "../context/notificationContext";

const url = process.env.REACT_APP_API_URL;

type MoodType = "happy" | "sad" | "neutral" | "angry" | "surprised";

const Mood = () => {
  const [mood, setMood] = useState<MoodType>("neutral");

  const navigate = useNavigate();
  const { openNotification } = useNotification();

  //Get nickname from Redux

  const handleNext = () => {
    if (!mood) {
      openNotification("warning", "Please select a mood!");
      return;
    }
    openNotification("success", "Mood selected successfully");
    navigate("/chat/text", { replace: true });
  };

  const mouthPaths: Record<MoodType, string> = {
    happy: "M30 60 Q50 80 70 60",
    sad: "M30 70 Q50 50 70 70",
    neutral: "M30 65 Q50 65 70 65",
    angry: "M30 70 Q50 55 70 70",
    surprised: "M45 60 A5 5 0 1 0 55 60 A5 5 0 1 0 45 60",
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="z-10 bg-[#BDF2D0] bg-opacity-10 backdrop-blur-md rounded-2xl p-8 w-[90%] max-w-md text-center shadow-xl border border-white/20 relative">
        <div className="flex flex-col items-center mb-0">
          <img
            src={logo}
            alt="BlissMe Logo"
            className="w-32 h-10 object-contain"
          />
        </div>

        <h3 className="text-black text-xl md:text-2xl mb-2">
          Welcome to BlissMe App
        </h3>

        <div className="relative flex flex-col items-center w-full max-w-md mx-auto">
          <img
            src={heart}
            alt="Heart"
            className="w-34 h-16 animate-wiggle animate-infinite"
          />

          <div className="bottom-0 w-[90%] bg-[#DCF2DE] shadow-md rounded-lg px-4 py-3 translate-y-[-10%]">
            <label className="text-gray-600 text-sm text-center block max-w-full mb-2">
              Select your current mood by changing the face expression!
            </label>

            {/* Face SVG */}
            <div className="flex justify-center my-4">
              <svg width="100" height="100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="#FFEBB7"
                  stroke="#333"
                  strokeWidth="2"
                />
                <circle cx="35" cy="40" r="4" fill="#333" />
                <circle cx="65" cy="40" r="4" fill="#333" />
                <path
                  d={mouthPaths[mood]}
                  stroke="#333"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </div>

            {/* Mood buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {(
                ["happy", "sad", "neutral", "angry", "surprised"] as MoodType[]
              ).map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`px-3 py-1 text-sm rounded-md shadow-md transition 
                                        ${
                                          mood === m
                                            ? "bg-[#1B5E3A] text-white"
                                            : "bg-white text-black hover:bg-[#E6FFE6]"
                                        }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          type="default"
          onClick={handleNext}
          className="bg-[#4B9B6E] hover:bg-[#1B5E3A] text-white border-none shadow-md"
        >
          Go
        </Button>
      </div>
    </div>
  );
};

export default Mood;
