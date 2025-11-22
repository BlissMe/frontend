import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TreePine, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";
import { Progress } from "../../components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { useNavigate } from "react-router-dom";

const MEDITATION_DURATION = 5 * 60; // 5 minutes in seconds

export function ForestGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MEDITATION_DURATION);
  const [audioElements] = useState({
    birds: new Audio("/sounds/birds.mp3"),
    wind: new Audio("/sounds/wind.mp3"),
    leaves: new Audio("/sounds/leaves.mp3"),
  });
  const navigate = useNavigate();

  useEffect(() => {
    Object.values(audioElements).forEach((audio) => {
      audio.loop = true;
      audio.volume = volume / 100;
    });

    return () => {
      Object.values(audioElements).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  useEffect(() => {
    Object.values(audioElements).forEach((audio) => {
      audio.volume = volume / 100;
    });
  }, [volume]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(
            ((MEDITATION_DURATION - newTime) / MEDITATION_DURATION) * 100
          );
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const togglePlay = () => {
    if (isPlaying) {
      Object.values(audioElements).forEach((audio) => audio.pause());
    } else {
      Object.values(audioElements).forEach((audio) => audio.play());
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] mt-20">
      <button
        onClick={() => navigate("/chat-new/text")}
        className="
          fixed top-4 right-8 z-50 
          bg-white/15 backdrop-blur-md border border-white/22
        text-black text-sm font-medium px-4 py-2 rounded-xl shadow-lg
          hover:bg-white/20 hover:scale-105 transition-transform duration-200
        "
      >
        ← Back to Chat
      </button>
      <Card className="border-slate-300/20 bg-[#0b1213] text-white w-full max-w-md shadow-xl rounded-2xl">
        {/* Card Header */}
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-semibold text-white">
            Mindful Forest
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Relax and meditate with the calming sounds of nature 🌲
          </CardDescription>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="flex flex-col items-center space-y-8">
          {/* Animated Tree */}
          <div className="relative w-48 h-48">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent rounded-full blur-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <TreePine className="w-24 h-24 text-green-600" />
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="w-64 space-y-6">
            {/* Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#f9fbfc]">
                <span>Volume</span>
                <span>{volume}%</span>
              </div>
              <div className="flex items-center gap-2">
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-[#f9fbfc]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#f9fbfc]" />
                )}
                <Slider
                  value={[volume]}
                  onValueChange={(value: any) => setVolume(value[0])}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            {/* Progress */}
            <Progress value={progress} className="h-2" />

            {/* Play / Pause and Timer */}
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-[#f9fbfc]">
                {formatTime(timeLeft)}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                className="rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-[#f9fbfc]" />
                ) : (
                  <Play className="h-4 w-4 text-[#f9fbfc]" />
                )}
              </Button>
              <span className="text-sm text-[#f9fbfc]">
                {formatTime(MEDITATION_DURATION)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
