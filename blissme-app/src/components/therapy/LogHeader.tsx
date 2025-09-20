type LogHeaderProps = {
  phase: number;
  setPhase: (step: number) => void; 
};

const LogHeader = ({ phase, setPhase }: LogHeaderProps) => {
  const totalSteps = 4;

  return (
    <div className="flex flex-col gap-6">
      <div className="font-RedditSans text-neutral-900 font-bold text-3xl tracking-[-0.019rem]">
        Log Your Mood
      </div>

      <div className="grid grid-cols-4 gap-4 -mt-4">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`bg-green-200 w-full h-1.5 rounded-full cursor-pointer`}
            onClick={() => {
              if (i <= phase) setPhase(i); 
              
            }}
          >
            <span
              className="w-full h-full bg-green-600 rounded-full block"
              style={phase >= i ? { display: "block" } : { display: "none" }}
            ></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogHeader;
