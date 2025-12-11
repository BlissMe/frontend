import star from "../../assets/svg/icon-reflection.svg";

interface TodayRecord {
  createdAt: string;
  date: string;
  mood: string;
  reflection?: string;
  sleepHours?: string;
  tags?: string[] | string;
}

interface TodayReflectionProps {
  todayRecord: TodayRecord;
}

const TodayReflection = ({ todayRecord }: TodayReflectionProps) => {
  const reflection = todayRecord?.reflection || null;
  const tags = todayRecord?.tags || null;

  const formattedTags: string[] | null = Array.isArray(tags)
    ? tags.map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
    : typeof tags === "string"
    ? tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
    : null;

  if (!reflection && !formattedTags) return null;

  return (
    <section className="flex flex-col gap-4 p-5 w-full rounded-2xl text-white"  style={{
    background: "linear-gradient(135deg, #1E1E2F 0%, #3A3A5A 100%)",
  }}>
      <div className="flex items-center gap-3">
        <img className="w-[22px] h-[22px]" src={star} alt="reflection icon" />
        <p className="font-RedditSans font-medium text-lg">Reflection</p>
      </div>
      {reflection && (
        <p className="font-RedditSans text-lg font-medium break-words">{reflection}</p>
      )}
      {formattedTags && (
        <p className="font-RedditSans italic flex flex-wrap gap-3 text-lg">
          {formattedTags.map((tag: string, index: number) => (
            <span key={index}>#{tag}</span>
          ))}
        </p>
      )}
    </section>
  );
};

export default TodayReflection;
