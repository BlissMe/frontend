import Happy from "../../../assets/svg/icon-happy-color.svg";
import Veryhappy from "../../../assets/svg/icon-very-happy-color.svg";
import Neutral from "../../../assets/svg/icon-neutral-color.svg";
import type { Dispatch, SetStateAction } from "react";
import Sad from "../../../assets/svg/icon-sad-color.svg";
import Verysad from "../../../assets/svg/icon-very-sad-color.svg";
import Button from "../Button";
import { useUserDataStore } from "../../../store/useUserDataStore";

type PhaseProps = {
  next: () => void;
  phase: number;
  setPhase?: Dispatch<SetStateAction<number>>;
  setLogIsVisible?: (value: boolean) => void;
};

const Phase1 = ({ next, phase }: PhaseProps) => {
  const logData = useUserDataStore((state) => state.logData);
  const logError = useUserDataStore((state) => state.logError);
  const setLogData = useUserDataStore((state) => state.setLogData);
  const setLogError = useUserDataStore((state) => state.setLogError);

  const humorOptions = ["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"];

  const humorIcons: Record<string, string> = {
    "Very Happy": Veryhappy,
    Happy: Happy,
    Neutral: Neutral,
    Sad: Sad,
    "Very Sad": Verysad,
  };

  const phase1Function = (e: React.FormEvent) => {
    e.preventDefault();
    if (logData.humor === "") {
      setLogError(true);
    } else {
      setLogError(false);
      next();
    }
  };

  return (
    <div
      className="flex-col gap-6"
      style={phase === 0 ? { display: "flex" } : { display: "none" }}
    >
      <div className="font-bold font-RedditSans text-2xl text-neutral-900">
        How was your mood today?
      </div>
      <div className="flex flex-col gap-2">
        {humorOptions.map((option) => (
          <div
            key={option}
            onClick={() => setLogData({ humor: option })}
            className="bg-white px-5 py-[4px] rounded-[0.625rem] flex items-center border-2 border-transparent cursor-pointer hover:bg-transparent"
            style={
              logData.humor === option
                ? { borderColor: "#4865db" }
                : { borderColor: "#E0E6FA" }
            }
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") setLogData({ humor: option });
            }}
          >
            <span
              className={`w-5 h-5 rounded-full ${
                logData.humor === option
                  ? "border-[5px] border-blue-600"
                  : "border-2 border-blue-200"
              }`}
            ></span>
            <p className="ml-3 font-semibold text-[1.25rem]">{option}</p>
            <img
              src={humorIcons[option]}
              className="w-[38px] h-[38px] ml-auto"
            />
          </div>
        ))}
      </div>

      <form onSubmit={phase1Function} className="flex flex-col mt-2">
        {logError && (
          <div className="flex items-center gap-1.5 mb-4">
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path
                d="M7.75 0.75C12 0.75 15.5 4.25 15.5 8.5C15.5 12.7812 12 16.25 7.75 16.25C3.46875 16.25 0 12.7812 0 8.5C0 4.25 3.46875 0.75 7.75 0.75ZM7.75 4.1875C7 4.1875 6.4375 4.78125 6.4375 5.5C6.4375 6.25 7 6.8125 7.75 6.8125C8.46875 6.8125 9.0625 6.25 9.0625 5.5C9.0625 4.78125 8.46875 4.1875 7.75 4.1875ZM9.5 12.125V11.375C9.5 11.1875 9.3125 11 9.125 11H8.75V7.875C8.75 7.6875 8.5625 7.5 8.375 7.5H6.375C6.15625 7.5 6 7.6875 6 7.875V8.625C6 8.84375 6.15625 9 6.375 9H6.75V11H6.375C6.15625 11 6 11.1875 6 11.375V12.125C6 12.3438 6.15625 12.5 6.375 12.5H9.125C9.3125 12.5 9.5 12.3438 9.5 12.125Z"
                fill="#E60013"
              />
            </svg>
            <p className="text-red-700">
              Please select a mood before continuing.
            </p>
          </div>
        )}
        <Button
          buttonText="Continue"
          py="0.5rem"
          fontSize="1.5rem"
          lineHeight="140%"
          letterSpacing="0px"
          className="!bg-green-500 hover:!bg-green-600 text-white rounded-md"
        />
      </form>
    </div>
  );
};
export default Phase1;
