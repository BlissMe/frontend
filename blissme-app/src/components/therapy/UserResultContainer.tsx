import ResultCard from "./ResultCard";
import veryHappyWhiteEmoji from "../../assets/svg/icon-very-happy-white.svg";
import neutralWhiteEmoji from "../../assets/svg/icon-neutral-white.svg";
import happyWhiteEmoji from "../../assets/svg/icon-happy-white.svg";
import sadWhiteEmoji from "../../assets/svg/icon-sad-white.svg";
import verySadWhiteEmoji from "../../assets/svg/icon-very-sad-white.svg";
import risingSvg from "../../assets/svg/icon-trend-increase.svg";
import sameSvg from "../../assets/svg/icon-trend-same.svg";
import fallingSvg from "../../assets/svg/icon-trend-decrease.svg";
import risingSvgWhite from "../../assets/svg/icon-trend-increase-white.svg";
import sameSvgWhite from "../../assets/svg/icon-trend-same-white.svg";
import fallingSvgWhite from "../../assets/svg/icon-trend-decrease-white.svg";
import zzzSvg from "../../assets/svg/icon-sleep-white.svg";
import type { FC } from "react";

type AverageMoodType = {
  text: string;
  bg: string;
  info: string | null;
  emoji: string | null;
  arrow: string | null;
  color1: string;
  color2: string;
};

type Props = {
  records: any[];
};

const UserResultContainer: FC<Props> = ({ records }) => {
  const scale = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];

  const averageMoodResult: AverageMoodType = (() => {
    if (!records || records.length < 5) {
      return {
        text: "Keep tracking",
        bg: "bg-blue-100",
        emoji: null,
        info: "Log 5 check-ins to see your average mood.",
        arrow: null,
        color1: "text-neutral-900",
        color2: "text-[#21214db3]",
      };
    }

    const lastFive = records.slice(-5);

    const count: Record<string, number> = {};
    lastFive.forEach(({ mood }) => {
      if (mood) count[mood] = (count[mood] || 0) + 1;
    });

    let mostCommonMood = "Neutral";
    const entries = Object.entries(count);
    if (entries.length === 1) mostCommonMood = entries[0][0];
    else if (entries.length === 5) mostCommonMood = "Neutral";
    else {
      entries.sort((a, b) => b[1] - a[1]);
      mostCommonMood = entries[0][0];
    }

    // Trend calculation
    const score = (mood: string) => scale.indexOf(mood);
    const diffs = lastFive.map((d) => score(d.mood!));
    const totalChange = diffs
      .slice(1)
      .reduce((acc, curr, i) => acc + (curr - diffs[i]), 0);

    const trend =
      totalChange > 0
        ? "Increase from the previous 5 check-ins"
        : totalChange < 0
        ? "Decrease from the previous 5 check-ins"
        : "Same as the previous 5 check-ins";

    const trendArrow =
      trend === "Same as the previous 5 check-ins"
        ? sameSvg
        : trend === "Decrease from the previous 5 check-ins"
        ? fallingSvg
        : risingSvg;

    // Map mood to emoji/bg/colors
    switch (mostCommonMood) {
      case "Very Happy":
        return {
          text: "Very Happy",
          bg: "bg-[#FFC97C]",
          emoji: veryHappyWhiteEmoji,
          info: trend,
          arrow: trendArrow,
          color1: "text-neutral-900",
          color2: "text-neutral-900",
        };
      case "Happy":
        return {
          text: "Happy",
          bg: "bg-[#89E780]",
          emoji: happyWhiteEmoji,
          info: trend,
          arrow: trendArrow,
          color1: "text-neutral-900",
          color2: "text-neutral-900",
        };
      case "Neutral":
        return {
          text: "Neutral",
          bg: "bg-[#89CAFF]",
          emoji: neutralWhiteEmoji,
          info: trend,
          arrow: trendArrow,
          color1: "text-neutral-900",
          color2: "text-neutral-900",
        };
      case "Sad":
        return {
          text: "Sad",
          bg: "bg-[#B8B1FF]",
          emoji: sadWhiteEmoji,
          info: trend,
          arrow: trendArrow,
          color1: "text-neutral-900",
          color2: "text-neutral-900",
        };
      case "Very Sad":
        return {
          text: "Very Sad",
          bg: "bg-[#FF9B99]",
          emoji: verySadWhiteEmoji,
          info: trend,
          arrow: trendArrow,
          color1: "text-neutral-900",
          color2: "text-neutral-900",
        };
      default:
        return {
          text: "Keep tracking",
          bg: "bg-blue-100",
          emoji: null,
          info: trend,
          arrow: trendArrow,
          color1: "text-neutral-900",
          color2: "text-[#21214db3]",
        };
    }
  })();

  // --- Average Sleep ---
  const sleepResult: AverageMoodType = (() => {
    if (!records || records.length < 5) {
      return {
        text: "Not enough data yet!",
        info: "Track 5 nights to view average sleep.",
        bg: "bg-blue-100",
        emoji: null,
        arrow: null,
        color1: "text-neutral-900",
        color2: "text-[#21214db3]",
      };
    }

    const sleepParameter: Record<string, number> = {
      "0-2 hours": 1,
      "3-4 hours": 3.5,
      "5-6 hours": 5.5,
      "7-8 hours": 7.5,
      "9+ hours": 9,
    };

    const lastFive = records
      .slice(-5)
      .map((r) => sleepParameter[r.sleepHours as keyof typeof sleepParameter]);

    const avg = lastFive.reduce((a, b) => a + b, 0) / 5;

    const finalSleep =
      avg < 2.25
        ? "0-2 Hours"
        : avg < 4.5
        ? "3-4 Hours"
        : avg < 6.5
        ? "5-6 Hours"
        : avg < 8.25
        ? "7-8 Hours"
        : "9+ Hours";

    const sleepTrend =
      lastFive
        .slice(1)
        .reduce((acc, curr, i) => acc + (curr - lastFive[i]), 0) > 0
        ? "Increase from the previous 5 check-ins"
        : lastFive
            .slice(1)
            .reduce((acc, curr, i) => acc + (curr - lastFive[i]), 0) < 0
        ? "Decrease from the previous 5 check-ins"
        : "Same as the previous 5 check-ins";

    const trendEmoji =
      sleepTrend === "Increase from the previous 5 check-ins"
        ? risingSvgWhite
        : sleepTrend === "Decrease from the previous 5 check-ins"
        ? fallingSvgWhite
        : sameSvgWhite;

    return {
      text: finalSleep,
      info: sleepTrend,
      bg: "bg-blue-600",
      emoji: zzzSvg,
      arrow: trendEmoji,
      color1: "text-white",
      color2: "text-white/70",
    };
  })();

  return (
    <section className="py-5 px-4 md:px-6 md:py-6 gap-6 flex flex-col bg-white w-full border border-blue-100 rounded-2xl min-[780px]:max-w-[370px] min-[1170px]:min-w-[305px]">
      <ResultCard
        averageResult={averageMoodResult}
        information="Average Mood"
      />
      <ResultCard averageResult={sleepResult} information="Average Sleep" />
    </section>
  );
};

export default UserResultContainer;
