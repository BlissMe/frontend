import zzz from "../../assets/svg/icon-sleep.svg";

interface TodaySleepProps {
  todayRecord: any;
}

const TodaySleep = ({ todayRecord }: TodaySleepProps) => {
  const sleep = todayRecord?.sleepHours || null;

  if (!sleep) return null;

  return (
    <section className="flex flex-col gap-4 p-5 w-full rounded-2xl text-white bg-gradient-to-r from-pink-400 to-orange-300">
      <div className="flex items-center gap-3">
        <img src={zzz} className="w-[24px] h-[24px]" alt="sleep icon" />
        <p className="font-RedditSans font-medium text-lg">Sleep Hours</p>
      </div>
      <h2 className="font-RedditSans font-bold text-4xl">{sleep}</h2>
    </section>
  );
};

export default TodaySleep;
