type LogHeaderProps = {
  phase: number;
};

const LogHeader = ({ phase }: LogHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <h2 className="font-RedditSans text-neutral-900 font-bold text-[2rem]/[140%] tracking-[-0.019rem] md:text-[2.5rem]/[120%]">
        Log your mood
      </h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-200 w-full h-1.5 rounded-full">
          <span
            className="w-full h-full bg-blue-600 rounded-full"
            style={phase >= 0 ? { display: "block" } : { display: "none" }}
          ></span>
        </div>
        <div className="bg-blue-200 w-full h-1.5 rounded-full">
          <span
            className="w-full h-full bg-blue-600 rounded-full"
            style={phase >= 1 ? { display: "block" } : { display: "none" }}
          ></span>
        </div>
        <div className="bg-blue-200 w-full h-1.5 rounded-full">
          <span
            className="w-full h-full bg-blue-600 rounded-full"
            style={phase >= 2 ? { display: "block" } : { display: "none" }}
          ></span>
        </div>
        <div className="bg-blue-200 w-full h-1.5 rounded-full">
          <span
            className="w-full h-full bg-blue-600 rounded-full"
            style={phase >= 3 ? { display: "block" } : { display: "none" }}
          ></span>
        </div>
      </div>
    </div>
  );
};
export default LogHeader;
