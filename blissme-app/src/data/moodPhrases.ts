type MoodType = "Very Happy" | "Happy" | "Neutral" | "Sad" | "Very Sad";

const moodPhrases: Record<MoodType, string[]> = {
  "Very Happy": [
    "You're shining brighter than ever!",
    "This day is one for the books!",
    "Your joy is contagious, keep spreading it!",
    "Happiness looks good on you!",
    "You’re riding a high vibe, enjoy it!",
  ],
  Happy: [
    "Things are going well, keep it up!",
    "Smiles suit you perfectly!",
    "Today feels like a warm breeze.",
    "Joy in the little things makes all the difference.",
    "You're glowing with good energy!",
  ],
  Neutral: [
    "Not every day has to be amazing, steady counts too.",
    "Balance is a superpower.",
    "A calm mind is a powerful tool.",
    "You're in a good place, trust the process.",
    "Even stillness is part of progress.",
  ],
  Sad: [
    "It’s okay to feel down, emotions are valid.",
    "Take it slow and be kind to yourself.",
    "Hard moments don’t last forever.",
    "You’re allowed to rest.",
    "The clouds will pass, stay with it.",
  ],
  "Very Sad": [
    "You're not alone, even when it feels like it.",
    "Some days are heavy, give yourself grace.",
    "It’s brave to feel deeply.",
    "You made it through today, that matters.",
    "Pain is real, but so is healing.",
  ],
};

export default moodPhrases;
