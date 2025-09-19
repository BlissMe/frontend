import veryHappyWhiteEmoji from "../../assets/svg/icon-very-happy-white.svg";
import neutralWhiteEmoji from "../../assets/svg/icon-neutral-white.svg";
import happyWhiteEmoji from "../../assets/svg/icon-happy-white.svg";
import sadWhiteEmoji from "../../assets/svg/icon-sad-white.svg";
import verySadWhiteEmoji from "../../assets/svg/icon-very-sad-white.svg";
import veryHappyEmoji from "../../assets/svg/icon-very-happy-color.svg";
import happyEmoji from "../../assets/svg/icon-happy-color.svg";
import neutralEmoji from "../../assets/svg/icon-neutral-color.svg";
import sadEmoji from "../../assets/svg/icon-sad-color.svg";
import verySadEmoji from "../../assets/svg/icon-very-sad-color.svg";

type VisualMoodBarType = {
  hours: string;
  mood: string;
  reflection: string;
  tags?: string[];
  isLastFour?: boolean;
};
type Mood = "Very Happy" | "Happy" | "Neutral" | "Sad" | "Very Sad";

const VisualMoodBar = ({
  hours,
  mood,
  reflection,
  tags = [],
  isLastFour,
}: VisualMoodBarType) => {
  const heightMap: Record<string, string> = {
    "0-2 hours": "h-[58px]",
    "3-4 hours": "h-[104px]",
    "5-6 hours": "h-[165px]",
    "7-8 hours": "h-[214px]",
    "9+ hours": "h-[263px]",
  };

  const moodMap: Record<Mood, [string, string, string]> = {
    "Very Happy": ["bg-[#FFC97C]", veryHappyWhiteEmoji, veryHappyEmoji],
    Happy: ["bg-[#89E780]", happyWhiteEmoji, happyEmoji],
    Neutral: ["bg-[#89CAFF]", neutralWhiteEmoji, neutralEmoji],
    Sad: ["bg-[#B8B1FF]", sadWhiteEmoji, sadEmoji],
    "Very Sad": ["bg-[#FF9B99]", verySadWhiteEmoji, verySadEmoji],
  };

  const barHeight = heightMap[hours] ?? "h-[58px]";
  const [barColor, barWhiteEmoji, barEmoji] =
    moodMap[mood as Mood] ?? moodMap["Neutral"];

  return (
    <div className="w-10 flex flex-col-reverse items-center h-fit self-end">
      <div
        className={`w-full flex flex-col items-center rounded-full group relative cursor-pointer ${barHeight} ${barColor}`}
      >
        <div
          className={`absolute flex flex-col opacity-0 group-hover:opacity-100 px-3 py-3 rounded-[10px] pointer-events-none w-[175px] bg-white border border-blue-100 shadow-[0px_4px_7px_0px_rgba(33,33,77,0.16)] ${
            hours === "0-2 hours"
              ? "top-[-205px]"
              : hours === "3-4 hours"
              ? "top-[-159px]"
              : hours === "5-6 hours"
              ? "top-[-95px]"
              : hours === "7-8 hours"
              ? "top-[-48px]"
              : "top-0"
          } z-40 ${
            isLastFour ? "left-[51px]" : "right-[51px]"
          } gap-3 whitespace-pre-wrap`}
        >
          <div className="flex flex-col gap-1.5">
            <p className="font-RedditSans text-neutral-600 font-semibold text-[0.813rem]">
              Mood
            </p>
            <div className="flex items-center gap-1.5">
              <img src={barEmoji} className="w-4 h-4" alt="mood icon" />
              <p className="font-RedditSans text-neutral-900 text-[0.938rem]/[140%] tracking-[-0.019rem]">
                {mood}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="font-RedditSans text-neutral-600 font-semibold text-[0.813rem]">
              Sleep
            </p>
            <p className="font-RedditSans text-neutral-900 text-[0.938rem]/[140%] tracking-[-0.019rem]">
              {hours}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="font-RedditSans text-neutral-600 font-semibold text-[0.813rem]">
              Reflection
            </p>
            <p className="font-RedditSans text-neutral-900 text-[0.938rem]/[140%] line-clamp-2 tracking-[-0.019rem]">
              {reflection || "No reflection"}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="font-RedditSans text-neutral-600 font-semibold text-[0.813rem]">
              Tags
            </p>
            <p className="font-RedditSans text-neutral-900 text-[0.938rem]/[140%] tracking-[-0.019rem]">
              {tags.length > 0 ? tags.join(", ") : "No tags"}
            </p>
          </div>
        </div>
        <div
          className={`${
            isLastFour
              ? "absolute right-[-15px] top-3 border-y-8 border-y-transparent border-r-[12px] border-r-white z-50"
              : "absolute left-[-15px]  top-3 border-y-8 border-y-transparent border-l-[12px] border-l-white z-50"
          } opacity-0 group-hover:opacity-100`}
        ></div>
        <img className="w-[30px] mt-[5px]" src={barWhiteEmoji} alt="bar icon" />
      </div>
    </div>
  );
};

export default VisualMoodBar;
