import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MeditationApp: React.FC = () => {
  const songRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const outlineRef = useRef<SVGCircleElement | null>(null);
  const navigate = useNavigate();
  const outlineLength = 1360;
  const [isPlaying, setIsPlaying] = useState(false);
  const [fakeDuration, setFakeDuration] = useState(600);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (outlineRef.current) {
      const length = outlineRef.current.getTotalLength();
      outlineRef.current.style.strokeDasharray = length.toString();
      outlineRef.current.style.strokeDashoffset = length.toString();
    }
  }, []);

  const togglePlay = () => {
    const song = songRef.current;
    const video = videoRef.current;
    if (!song || !video) return;

    if (song.paused) {
      song.play();
      video.play();
      setIsPlaying(true);
    } else {
      song.pause();
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const song = songRef.current;
    if (!song) return;

    const updateTime = () => {
      const ct = song.currentTime;
      setCurrentTime(ct);

      if (outlineRef.current) {
        const progress = outlineLength - (ct / fakeDuration) * outlineLength;
        outlineRef.current.style.strokeDashoffset = progress.toString();
      }

      if (ct >= fakeDuration) {
        song.pause();
        song.currentTime = 0;
        setIsPlaying(false);
        if (videoRef.current) videoRef.current.pause();
      }
    };

    song.addEventListener("timeupdate", updateTime);
    return () => song.removeEventListener("timeupdate", updateTime);
  }, [fakeDuration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
     {/*  <button
        onClick={() => navigate("/chat-new/text")}
        className="
          fixed top-4 right-8 z-50 
          bg-white/15 backdrop-blur-md border border-white/22
        text-black text-sm font-medium px-4 py-2 rounded-xl shadow-lg
          hover:bg-white/20 hover:scale-105 transition-transform duration-200
        "
      >
        ← Back to Chat
      </button> */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-xl overflow-hidden flex flex-col ">
        {/* Video background */}
        <video
          ref={videoRef}
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/rain.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center p-6">
          {/* Header */}
          <h1
            className="text-3xl font-bold mb-12"
            style={{ fontFamily: "Merienda, cursive" }}
          >
            Meditation Session
          </h1>

          {/* Main row: Time buttons, Player, Sound pickers */}
          <div className="flex md:flex-row items-start w-full justify-around mb-24 flex-col gap-8">
            {/* Time Buttons */}
            <div className="flex md:flex-col gap-4">
              <button
                className="px-3 py-1 bg-white/60 rounded-lg"
                onClick={() => setFakeDuration(120)}
              >
                2 Min
              </button>
              <button
                className="px-3 py-1 bg-white/60 rounded-lg"
                onClick={() => setFakeDuration(300)}
              >
                5 Min
              </button>
              <button
                className="px-3 py-1 bg-white/60 rounded-lg"
                onClick={() => setFakeDuration(600)}
              >
                10 Min
              </button>
            </div>

            {/* Player */}
            <div className="relative flex flex-col items-center gap-2">
              {/* Timer on top */}
              <div className="absolute -top-6 text-white text-sm font-bold">
                {formatTime(fakeDuration - currentTime)}
              </div>

              {/* Player */}
              <div className="relative flex items-center justify-center w-[120px] h-[120px]">
                <audio ref={songRef}>
                  <source src="/sounds/rain.mp3" />
                </audio>

                {/* Background circle */}
                <svg width="120" height="120" className="absolute">
                  <circle
                    cx="60"
                    cy="60"
                    r="55"
                    stroke="white"
                    strokeWidth="6"
                    fill="none"
                    opacity={0.1}
                  />
                </svg>

                {/* Progress circle */}
                <svg width="120" height="120" className="absolute">
                  <circle
                    ref={outlineRef}
                    cx="60"
                    cy="60"
                    r="55"
                    stroke="#0ea5e9"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Play/Pause button */}
                <img
                  src={isPlaying ? "/svg/pause.svg" : "/svg/play.svg"}
                  className="w-10 h-10 cursor-pointer z-10"
                  onClick={togglePlay}
                  alt="play/pause"
                />
              </div>
            </div>

            {/* Sound pickers */}
            <div className="flex flex-row md:flex-col gap-4">
              <button
                className="rounded-full bg-[#4972a1] h-16 w-16 flex items-center justify-center"
                onClick={() => {
                  if (songRef.current && videoRef.current) {
                    songRef.current.src = "/sounds/rain.mp3";
                    videoRef.current.src = "/videos/rain.mp4";
                    togglePlay();
                  }
                }}
              >
                <img src="/svg/rain.svg" alt="rain" className="w-10 h-10" />
              </button>
              <button
                className="rounded-full bg-[#a14f49] h-16 w-16 flex items-center justify-center"
                onClick={() => {
                  if (songRef.current && videoRef.current) {
                    songRef.current.src = "/sounds/beach.mp3";
                    videoRef.current.src = "/videos/beach.mp4";
                    togglePlay();
                  }
                }}
              >
                <img src="/svg/beach.svg" alt="beach" className="w-10 h-10" />
              </button>
            </div>
          </div>

          {/* Back to chat button at bottom-left */}
          <button
            onClick={() => navigate("/chat-new/text")}
            className="absolute bottom-4 left-4 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow z-20"
          >
            ← Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeditationApp;
