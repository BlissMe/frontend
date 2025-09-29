import React, { useRef, useState, useEffect } from "react";

const MeditationApp: React.FC = () => {
  const songRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const outlineRef = useRef<SVGCircleElement | null>(null);

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

  // Handle play / pause
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

  // Restart song
  const restartSong = () => {
    if (songRef.current) {
      songRef.current.currentTime = 0;
    }
  };

  // Update timer + stroke
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
    <div className="relative">
      <h1 className="text-center text-white text-4xl font-montserrat pt-8">
        MEDITATION WEB APP
      </h1>

      <video
        ref={videoRef}
        loop
        autoPlay={false}
        muted
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/rain.mp4" type="video/mp4" />
      </video>

      <div className="app relative z-10 h-[80vh] flex justify-evenly items-center font-montserrat">
        <div className="time-select flex flex-col justify-evenly items-center h-[80%] flex-1 text-white">
          <button onClick={() => setFakeDuration(120)}>2 Minutes</button>
          <button onClick={() => setFakeDuration(300)}>5 Minutes</button>
          <button onClick={() => setFakeDuration(600)}>10 Minutes</button>
        </div>

        <div className="player-container relative flex flex-col justify-evenly items-center h-[80%] flex-1 text-white">
          <audio ref={songRef} className="song">
            <source src="/sounds/rain.mp3" />
          </audio>

          <div>
            <img
              src={isPlaying ? "/svg/pause.svg" : "/svg/play.svg"}
              className="play w-[70px] cursor-pointer"
              alt="image"
              onClick={togglePlay}
            />
            <br />
            <img
              src="/svg/replay.svg"
              className="replay w-[30px] cursor-pointer mt-6"
              onClick={restartSong}
              alt="replay"
            />
          </div>

          <svg
            className="track-outline absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-90deg] pointer-events-none"
            width="453"
            height="453"
            viewBox="0 0 453 453"
          >
            <circle
              cx="226.5"
              cy="226.5"
              r="216.5"
              stroke="white"
              strokeWidth="20"
              fill="none"
            />
          </svg>

          <svg
            className="moving-outline absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-90deg] pointer-events-none"
            width="453"
            height="453"
            viewBox="0 0 453 453"
          >
            <circle
              ref={outlineRef}
              cx="226.5"
              cy="226.5"
              r="216.5"
              stroke="#018EBA"
              strokeWidth="20"
              fill="none"
            />
          </svg>

          <h3 className="time-display absolute text-white text-5xl bottom-[10%]">
            {formatTime(fakeDuration - currentTime)}
          </h3>
        </div>

        {/* Sound Picker */}
        <div className="sound-picker flex flex-col justify-evenly items-center h-[80%] flex-1">
          <button
            className="rounded-full bg-[#4972a1] h-[120px] w-[120px] flex items-center justify-center"
            onClick={() => {
              if (songRef.current && videoRef.current) {
                songRef.current.src = "/sounds/rain.mp3";
                videoRef.current.src = "/videos/rain.mp4";
                togglePlay();
              }
            }}
          >
            <img src="/svg/rain.svg" alt="rain" />
          </button>
          <button
            className="rounded-full bg-[#a14f49] h-[120px] w-[120px] flex items-center justify-center"
            onClick={() => {
              if (songRef.current && videoRef.current) {
                songRef.current.src = "/sounds/beach.mp3";
                videoRef.current.src = "/videos/beach.mp4";
                togglePlay();
              }
            }}
          >
            <img src="/svg/beach.svg" alt="beach" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeditationApp;
