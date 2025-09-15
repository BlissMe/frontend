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

  const tags = todayRecord?.tags ||  null;

  const formattedTags: string[] | null = Array.isArray(tags)
    ? tags.map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
    : typeof tags === "string"
    ? tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
    : null;

  if (!reflection || !formattedTags) return null;

  return (
    <section className="p-5 flex flex-col bg-white rounded-2xl gap-4 lg:h-full">
      <div className="flex items-center gap-3">
        <img className="w-[22px] h-[22px]" src={star} alt="reflection icon" />
        <p className="font-RedditSans text-neutral-600 font-medium text-[1.125rem]/[120%]">
          Reflection of the day
        </p>
      </div>
      <p className="font-RedditSans text-neutral-900 font-medium text-[1.125rem]/[120%] break-words min-h-20">
        {reflection}
      </p>
      <p className="font-RedditSans text-neutral-600 font-medium italic flex flex-wrap gap-3 text-[1.125rem]/[130%]">
        {formattedTags.map((tag: string, index: number) => (
          <span key={index}>#{tag}</span>
        ))}
      </p>
    </section>
  );
};

export default TodayReflection;
