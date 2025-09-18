import zzz from "../../assets/svg/icon-sleep-white.svg";

interface TodaySleepProps {
  todayRecord: any;
}

const TodaySleep = ({ todayRecord }: TodaySleepProps) => {
  const sleep = todayRecord?.sleepHours || null;

  if (!sleep) return null;

  return (
    <section className="flex flex-col gap-4 p-5 w-full rounded-2xl text-white"  style={{
    background: "linear-gradient(135deg, #1E1E2F 0%, #3A3A5A 100%)",
  }}>
      <div className="flex items-center gap-3">
        <img src={zzz} className="w-[24px] h-[24px]" alt="sleep icon" />
        <p className="font-RedditSans font-medium text-lg">Sleep Hours</p>
      </div>
      <h2 className="font-RedditSans font-bold text-4xl">{sleep}</h2>
    </section>
  );
};

export default TodaySleep;
