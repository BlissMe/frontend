import type { Dispatch, SetStateAction } from "react";
import Button from "../Button";
import { useUserDataStore } from "../../../store/useUserDataStore";

type PhaseProps = {
  next: () => void;
  phase: number;
  setPhase?: Dispatch<SetStateAction<number>>;
  setLogIsVisible?: (value: boolean) => void;
  onSubmit?: (mood: string, sleepHours: string, description: string, tags: string[]) => void;
};

const Phase4 = ({ next, phase, setPhase, setLogIsVisible, onSubmit }: PhaseProps) => {
  const sleepOptions = ["0-2 hours", "3-4 hours", "5-6 hours", "7-8 hours", "9+ hours"];
  const logData = useUserDataStore((state) => state.logData);
  const logedToday = useUserDataStore((state) => state.logedToday);
  const setLogData = useUserDataStore((state) => state.setLogData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logData.horasSono) return alert("Please select sleep hours!");

    if (onSubmit) {
      onSubmit(logData.humor, logData.horasSono, logData.descricao, logData.tags);
    }

    if (setPhase && setLogIsVisible) {
      setPhase(0);
      setLogIsVisible(false);
    }

    next();
  };

  if (logedToday) {
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="font-bold text-xl text-center text-blue-600">
          Mood logged successfully!
        </p>
        <form onSubmit={handleSubmit}>
<Button buttonText="Close" py="1rem" fontSize="1.5rem" lineHeight="140%" letterSpacing="0px" />        </form>
      </div>
    );
  }

  return (
    <div className="flex-col gap-6" style={phase === 3 ? { display: "flex" } : { display: "none" }}>
      <h2 className="font-bold text-[1.75rem] md:text-2xl text-neutral-900">
        How many hours did you sleep?
      </h2>
      <div className="flex flex-col gap-3">
        {sleepOptions.map((option) => (
          <div
            key={option}
            onClick={() => setLogData({ horasSono: option })}
            className="bg-white px-5 py-[10px] rounded flex items-center border-2 cursor-pointer"
            style={
              logData.horasSono === option
                ? { borderColor: "#4865db" }
                : { borderColor: "#E0E6FA" }
            }
          >
            <span
              className={`w-5 h-5 rounded-full ${
                logData.horasSono === option
                  ? "border-[5px] border-blue-600"
                  : "border-2 border-blue-200"
              }`}
            ></span>
            <p className="ml-3 font-semibold text-lg">{option}</p>
          </div>
        ))}
      </div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <Button formSubmit={true} buttonText="Submit" py="1rem" fontSize="1.5rem" lineHeight="140%" letterSpacing="0px" />
      </form>
    </div>
  );
};
export default Phase4;
