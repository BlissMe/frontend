import { type Dispatch, type SetStateAction, type FC } from "react";
import Phase1 from "./logform/Phase1";
import Phase2 from "./logform/Phase2";
import Phase3 from "./logform/Phase3";
import Phase4 from "./logform/Phase4";

type LogSliderProps = {
  phase: number;
  setPhase: Dispatch<SetStateAction<number>>;
  onSubmit: (mood: string, sleepHours: string, description: string) => void;
};

type PhaseProps = {
  next: () => void;
  phase: number;
  setPhase?: Dispatch<SetStateAction<number>>;
  setLogIsVisible?: (value: boolean) => void;
  onSubmit?: (mood: string, sleepHours: string, description: string) => void;
};

const LogSlider = ({ phase, setPhase, onSubmit }: LogSliderProps) => {
  const phaseComponents: FC<PhaseProps>[] = [Phase1, Phase2, Phase3, Phase4];

  const next = () => {
    setPhase((current) => {
      if (current === phaseComponents.length - 1) return current;
      return current + 1;
    });
  };

  return (
    <div>
      <div className="relative overflow-hidden transition-all duration-300">
        <div
          className="flex transition-transform duration-600 ease-in-out"
          style={{ transform: `translateX(-${phase * 100}%)` }}
        >
          {phaseComponents.map((Component, index) => (
            <div key={index} className="w-full shrink-0">
              <Component
                next={next}
                phase={phase}
                {...(index === 3 && { setPhase, setLogIsVisible: undefined, onSubmit })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogSlider;
