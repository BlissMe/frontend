import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Flower2,
  Wind,
  TreePine,
  Waves,
  Music2,
  PersonStanding,
  AudioLines,
  Smile,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { BreathingGame } from "./breathing-game";
import { ZenGarden } from "./zen-garden";
import { ForestGame } from "./forest-game";
import { OceanWaves } from "./ocean-waves";

const games = [
  {
    id: "breathing",
    title: "Breathing Patterns",
    description: "Follow calming breathing exercises with visual guidance",
    icon: Wind,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    duration: "5 mins",
    routeType: "therapy",
  },
  {
    id: "zen",
    title: "Zen Garden",
    description: "Create and maintain your digital peaceful space",
    icon: Flower2,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    duration: "10 mins",
    routeType: "therapy",
  },
  {
    id: "forest",
    title: "Mindful Forest",
    description: "Take a peaceful walk through a virtual forest",
    icon: TreePine,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    duration: "15 mins",
    routeType: "therapy",
  },
  {
    id: "ocean",
    title: "Ocean Waves",
    description: "Match your breath with gentle ocean waves",
    icon: Waves,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    duration: "8 mins",
    routeType: "therapy",
  },
  {
    id: "medication",
    title: "Medication",
    description: "Calm your mind with slow, mindful breaths",
    icon: Wind,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    duration: "5 mins",
    routeType: "therapy",
  },
  {
    id: "mood-tracker-home",
    title: "Mood Tracker",
    description: "Record how you feel and understand emotional patterns",
    icon: Smile,
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
    duration: "2 mins",
    routeType: "therapy",
  },
  {
    id: "all-songs",
    title: "Listen Me",
    description: "Listen to soothing sounds that bring peace and balance",
    icon: AudioLines,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    duration: "3 mins",
    routeType: "therapy",
  },
  {
    id: "body-scan",
    title: "Body Scan",
    description: "Gently observe your body and relax from head to toe",
    icon: PersonStanding,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    duration: "10 mins",
    routeType: "therapy",
  },

  {
    id: "therapy_game",
    title: "Number Game",
    description: "A simple activity to calm your mind using numbers",
    icon: Gamepad2,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    duration: "3 mins",
    routeType: "game",
  },
];

interface AnxietyGamesProps {
  onGamePlayed?: (gameName: string, description: string) => Promise<void>;
}

export const AnxietyGames = ({ onGamePlayed }: AnxietyGamesProps) => {
  const navigate = useNavigate();

  const handleGameStart = async (gameId: string) => {
    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    if (onGamePlayed) {
      try {
        await onGamePlayed(gameId, game.description || "");
      } catch (error) {
        console.error("Error logging game activity:", error);
      }
    }

    const routeBase = game.routeType === "game" ? "/game" : "/therapy";

    navigate(`${routeBase}/${gameId}`);
    console.log(`Navigating to ${routeBase}/${gameId}`);
  };

  return (
    <div className="p-6 justify-center items-center flex">
      <Card className="relative border-slate-300/20 bg-emerald-50/60 gap-4 flex flex-col pb-16">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-emerald-700 justify-center">
            <Gamepad2 className="h-5 w-5 text-emerald-700" />
            <h3 style={{ fontFamily: "Merienda, cursive" }}>
              Anxiety Relief Activities
            </h3>
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            Interactive exercises to help reduce stress and anxiety
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="max-h-[60vh] overflow-y-auto md:overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex"
                >
                  <Card
                    className="border-slate-300/20 bg-emerald-200 cursor-pointer transition-colors flex-1 flex flex-col"
                    onClick={() => handleGameStart(game.id)}
                  >
                    <CardContent className="p-4 flex flex-col flex-1">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`p-3 rounded-xl ${game.bgColor} ${game.color}`}
                        >
                          <game.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <h4
                            className="font-semibold text-emerald-800"
                            style={{ fontFamily: "Merienda, cursive" }}
                          >
                            {game.title}
                          </h4>
                          <p className="text-sm text-emerald-700 mt-1">
                            {game.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Music2 className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-500">
                          {game.duration}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>

        <button
          onClick={() => {
            const storedTherapy = localStorage.getItem("therapyInProgress");

            if (storedTherapy) {
              navigate("/chat-new/voice");
            } else {
              navigate("/chat-new/text");
            }
          }}
          className="absolute left-4 mt-4 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow"
        >
          ← Back to Chat
        </button>
      </Card>
    </div>
  );
};
