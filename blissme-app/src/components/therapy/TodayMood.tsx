import veryHappyEmoji from "../../assets/svg/icon-very-happy-color.svg";
import happyEmoji from "../../assets/svg/icon-happy-color.svg";
import neutralEmoji from "../../assets/svg/icon-neutral-color.svg";
import sadEmoji from "../../assets/svg/icon-sad-color.svg";
import verySadEmoji from "../../assets/svg/icon-very-sad-color.svg";
import moodPhrases from "../../data/moodPhrases";
import { useEffect, useState } from "react";

type MoodType = "Very Happy" | "Happy" | "Neutral" | "Sad" | "Very Sad";

type TodayMoodProps = {
  todayRecord: any | null;
};

const TodayMood = ({ todayRecord }: TodayMoodProps) => {
  const [phrase, setPhrase] = useState("");

  const moodMap: Record<string, string> = {
    "Very Happy": veryHappyEmoji,
    Happy: happyEmoji,
    Neutral: neutralEmoji,
    Sad: sadEmoji,
    "Very Sad": verySadEmoji,
  };

  const getRandomPhraseByMood = () => {
    const mood = todayRecord?.mood as MoodType;
    if (!mood) return "No mood recorded today.";
    const phrases = moodPhrases[mood];
    if (!phrases || phrases.length === 0) return "No phrase available.";
    const index = Math.floor(Math.random() * phrases.length);
    return phrases[index];
  };

  useEffect(() => {
    if (todayRecord) setPhrase(getRandomPhraseByMood());
  }, [todayRecord]);

  if (!todayRecord || phrase === "") return null;

  const moodEmoji = moodMap[todayRecord.mood as MoodType];

  return (
    <section className="flex flex-col gap-4 p-5 w-full rounded-2xl text-white bg-gradient-to-r from-blue-400 to-blue-300">
      <p className="font-RedditSans font-medium text-lg">Today Mood</p>
      <div className="flex items-center justify-between">
        <h2 className="font-RedditSans font-bold text-4xl">{todayRecord.mood}</h2>
        <img src={moodEmoji} alt="Mood Emoji" className="w-[50px] h-[50px]" />
      </div>
      <p className="italic">"{phrase}"</p>
    </section>
  );
};

export default TodayMood;
