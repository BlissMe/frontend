type LogHeaderProps = {
  phase: number;
};

const LogHeader = ({ phase }: LogHeaderProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="font-RedditSans text-neutral-900 font-bold text-3xl tracking-[-0.019rem]">
        Log Your Mood
      </div>
      <div className="grid grid-cols-4 gap-4 -mt-4">
        <div className="bg-green-200 w-full h-1.5 rounded-full">
          <span
            className="w-full h-full bg-green-600 rounded-full"
            style={phase >= 0 ? { display: "block" } : { display: "none" }}
          ></span>
        </div>
        <div className="bg-green-200 w-full h-1.5 rounded-full">
          <span
            className="w-full h-full bg-green-600 rounded-full"
            style={phase >= 1 ? { display: "block" } : { display: "none" }}
          ></span>
        </div>
        <div className="bg-green-200 w-full h-1.5 rounded-full">
          <span
            className="w-full h-full bg-green-600 rounded-full"
            style={phase >= 2 ? { display: "block" } : { display: "none" }}
          ></span>
        </div>
        <div className="bg-green-200 w-full h-1.5 rounded-full">
          <span
            className="w-full h-full bg-green-600 rounded-full"
            style={phase >= 3 ? { display: "block" } : { display: "none" }}
          ></span>
        </div>
      </div>
    </div>
  );
};
export default LogHeader;
