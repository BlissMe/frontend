import circle from "../../assets/svg/bg-pattern-averages.svg";

type averageMoodType = {
  text: string;
  bg: string;
  info: string | null;
  emoji: string | null;
  arrow: string | null;
  color1: string;
  color2: string;
};

type ResultCardProps = {
  averageResult: averageMoodType;
  information: string;
};

const ResultCard = ({ averageResult, information }: ResultCardProps) => {
  return (
    <div className="flex flex-col gap-3 ">
      <h2 className="font-RedditSans text-white font-semibold text-[1.25rem]/[140%] flex items-center">
        {information}
        <span className="font-RedditSans font-normal text-white text-[0.938rem]/[140%] tracking-[0.019rem] ml-1">
          (Last 5 check-ins)
        </span>
      </h2>
      <div
        className={`px-4 py-5 md:px-5 rounded-2xl  flex flex-col h-[150px] justify-center overflow-hidden relative ${averageResult.bg}`}
      >
        <div className="flex flex-col gap-3 mr-10">
          <div className="flex items-center gap-3">
            {averageResult.emoji && (
              <img className="w-6 h-6" src={averageResult.emoji} />
            )}
            <h3
              className={`font-RedditSans font-semibold text-2xl/[140%] ${averageResult.color1}`}
            >
              {averageResult.text}
            </h3>
          </div>
          <div className="flex gap-2">
            {averageResult.arrow && (
              <img
                className="self-baseline arrowalign:self-center mt-[3px]"
                src={averageResult.arrow}
              />
            )}
            <p
              className={`font-RedditSans text-[0.938rem]/[140%] tracking-[-0.019rem] ${averageResult.color2}`}
            >
              {averageResult.info}
            </p>
          </div>
        </div>
        <img className="absolute right-[-190px] top-[-40px]" src={circle}></img>
      </div>
    </div>
  );
};
export default ResultCard;
