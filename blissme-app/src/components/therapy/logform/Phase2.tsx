import FeelTags from "./FeelTags";
import type { Dispatch, SetStateAction } from "react";
import Button from "../Button";
import { useUserDataStore } from "../../../store/useUserDataStore";

type PhaseProps = {
  next: () => void;
  phase: number;
  setPhase?: Dispatch<SetStateAction<number>>;
  setLogIsVisible?: (value: boolean) => void;
};

const Phase2 = ({ next, phase }: PhaseProps) => {
  const logData = useUserDataStore((state) => state.logData);
  const logError = useUserDataStore((state) => state.logError);
  const setLogData = useUserDataStore((state) => state.setLogData);
  const setLogError = useUserDataStore((state) => state.setLogError);

  const moodTagOptions: Record<string, string[]> = {
    "Very Happy": ["Joyful", "Excited", "Grateful", "Confident", "Optimistic"],
    Happy: ["Content", "Peaceful", "Hopeful", "Motivated"],
    Neutral: ["Calm", "Tired", "Restless"],
    Sad: ["Lonely", "Disappointed", "Down", "Overwhelmed"],
    "Very Sad": ["Frustrated", "Anxious", "Irritable", "Stressed"],
  };

  const tagOptions = moodTagOptions[logData.humor] || [];

  const phase2Function = (e: React.FormEvent) => {
    e.preventDefault();
    if (logData.tags.length === 0) {
      setLogError(true);
    } else {
      setLogError(false);
      next();
    }
  };

  return (
    <div
      className="flex-col gap-2"
      style={phase === 1 ? { display: "flex" } : { display: "none" }}
    >
      <div className="flex flex-col">
        <div className="font-bold text-2xl text-neutral-900">
          How did you feel when you were {logData.humor.toLowerCase()}?
        </div>
        <p className="text-neutral-600">Select up to three tags:</p>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {tagOptions.map((tag) => {
          const handleClick = () => {
            const tagMarked = logData.tags.includes(tag);
            const tagsLimit = 3;

            if (tagMarked) {
              setLogData({ tags: logData.tags.filter((t) => t !== tag) });
            } else if (logData.tags.length < tagsLimit) {
              setLogData({ tags: [...logData.tags, tag] });
            }
          };

          return (
            <div
              key={tag}
              onClick={handleClick}
              onKeyDown={(e) => e.key === "Enter" && handleClick()}
              tabIndex={0}
            >
              <FeelTags tag={tag} />
            </div>
          );
        })}
      </div>

      <form onSubmit={phase2Function} className="flex flex-col">
        {logError && (
          <div className="flex items-center gap-1.5 mb-4">
            <p className="text-red-700">Please select at least one tag.</p>
          </div>
        )}
        <Button
          buttonText="Continue"
          py="0.5rem"
          fontSize="1.5rem"
          lineHeight="140%"
          letterSpacing="0px"
          className="!bg-green-500 hover:!bg-green-600 text-white rounded-md"
          formSubmit={true}
        />
      </form>
    </div>
  );
};

export default Phase2;
