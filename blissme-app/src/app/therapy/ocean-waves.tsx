import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Waves, Volume2, VolumeX, Play, Pause } from "lucide-react";
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

const BREATH_DURATION = 8; // seconds for one breath cycle
const SESSION_DURATION = 5 * 60; // 5 minutes in seconds

export function OceanWaves() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const waveControls = useAnimation();
  const [audio] = useState(new Audio("/sounds/waves.mp3"));

  useEffect(() => {
    audio.loop = true;
    audio.volume = volume / 100;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(((SESSION_DURATION - newTime) / SESSION_DURATION) * 100);
          return newTime;
        });
      }, 1000);

      // Animate waves
      waveControls.start({
        y: [0, -20, 0],
        transition: {
          duration: BREATH_DURATION,
          repeat: Infinity,
          ease: "easeInOut",
        },
      });
    } else {
      waveControls.stop();
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
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
      <Card className="border-slate-300/20 bg-[#0b1213] text-white w-full max-w-md shadow-xl rounded-2xl">
        {/* Card Header */}
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-semibold text-white">
            Ocean Waves
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Relax and match your breath with gentle ocean waves 🌊
          </CardDescription>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="flex flex-col items-center space-y-8">
          {/* Waves Animation */}
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full blur-xl" />
            <motion.div
              animate={waveControls}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <Waves className="w-24 h-24 text-blue-600" />
                <motion.div
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{
                    duration: BREATH_DURATION,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-blue-400/10 blur-xl rounded-full"
                />
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
              <span className="text-sm text-[#f9fbfc]">{formatTime(timeLeft)}</span>
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
              <span className="text-sm text-[#f9fbfc]">{formatTime(SESSION_DURATION)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
