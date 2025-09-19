import VisualMoodBar from "./VisualMoodBar";

const TrendContainer = ({ userMoodRecord }: { userMoodRecord: any[] }) => {
  const uniqueRecordsMap = new Map<string, any>();
  userMoodRecord.forEach((record) => {
    const dateKey = new Date(record.date).toISOString().split("T")[0];
    if (!uniqueRecordsMap.has(dateKey)) {
      uniqueRecordsMap.set(dateKey, record);
    }
  });
  const today = new Date();
  const last11Days: { dateKey: string; dateObj: Date }[] = [];
  for (let i = 10; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];
    last11Days.push({ dateKey, dateObj: d });
  }

  const finalRecords = last11Days.map(({ dateKey, dateObj }) => {
    const record = uniqueRecordsMap.get(dateKey);
    if (record) {
      return record;
    }
    return {
      date: dateObj.toISOString(),
      sleepHours: null,
      mood: null,
      reflection: null,
      tags: [],
      empty: true,
    };
  });

  const formattedDates = finalRecords.map((record) => {
  const d = new Date(record.date);
  return {
    day: d.getUTCDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
  };
});


  const reverseDates = [...formattedDates].reverse();
  const reverseRecords = [...finalRecords].reverse();

 return (
  <section
    className="px-4 py-5 md:px-5 md:py-8 rounded-2xl w-full flex flex-col border border-blue-100 gap-8 min-[780px]:w-[52%] min-[896px]:w-[57%] lg:w-[70%] min-[73.125rem]:w-full"
     style={{
    background: "linear-gradient(135deg, #1E1E2F 0%, #3A3A5A 100%)",
  }}
  >
    <h3 className="text-white font-RedditSans font-bold text-[1.75rem]/[130%] tracking-[-0.019rem] md:text-[2rem]/140%">
      Mood and sleep trends
    </h3>
    <div className="flex flex-row">
      <div className="flex flex-col gap-10 mr-4">
        {["9+ hours", "7-8 hours", "5-6 hours", "3-4 hours", "0-2 hours"].map(
          (label, i) => (
            <span
              key={i}
              className="font-RedditSans text-white text-[0.75rem]/[110%] flex gap-1.5 items-center w-[4.25rem]"
            >
              {/* SVG icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  fill="#FFFFFF"
                  d="M10 .906c-.031.219-.125.531-.25.688L7.156 4.5H9c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5H5.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.657L7.812 1.5H6a.494.494 0 0 1-.5-.5V.5c0-.25.219-.5.5-.5h3.5c.25 0 .5.25.5.5v.406ZM7.25 8a.76.76 0 0 1 .75.75v.813c-.031.218-.156.53-.313.687L3.876 14H7.5c.25 0 .5.25.5.5v1c0 .281-.25.5-.5.5H1.75a.722.722 0 0 1-.75-.75v-.781c0-.219.125-.531.281-.688L5.094 10H2a.494.494 0 0 1-.5-.5v-1c0-.25.219-.5.5-.5h5.25Zm7.25-1c.25 0 .5.25.5.5v.406c-.031.219-.125.532-.25.688L12.156 11.5H14c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5h-3.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.656L12.813 8.5H11a.494.494 0 0 1-.5-.5v-.5c0-.25.219-.5.5-.5h3.5Z"
                />
              </svg>
              {label}
            </span>
          )
        )}
      </div>

      <div className="overflow-x-auto overflow-y-hidden whitespace-nowrap flex flex-row-reverse w-full max-w-[626px]">
        <div className="w-[626px] flex flex-col shrink-0 relative">
          {/* Horizontal lines */}
          <div className="flex flex-col w-full mt-[7px] gap-[52px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-blue-100/[30%]"></div>
            ))}
          </div>

          <div className="absolute w-full flex flex-row-reverse gap-[1.125rem] h-[84%] items-end">
            {reverseRecords.map((record, index) =>
              record.empty ? (
                <div
                  key={index}
                  className="w-6 h-full flex items-end justify-center"
                ></div>
              ) : (
                <VisualMoodBar
                  key={index}
                  hours={record.sleepHours}
                  mood={record.mood}
                  reflection={record.reflection}
                  tags={
                    Array.isArray(record.tags)
                      ? record.tags
                      : typeof record.tags === "string"
                      ? [record.tags]
                      : []
                  }
                  isLastFour={index >= reverseRecords.length - 4}
                />
              )
            )}
          </div>

          <div className="flex gap-[1.125rem] flex-row-reverse mt-[55px]">
            {reverseDates.map((date, i) => (
              <div
                key={i}
                className="flex flex-col w-10 gap-1.5 items-center"
              >
                <span className="font-RedditSans text-white text-[0.75rem]/[110%]">
                  {date.month}
                </span>
                <span className="font-RedditSans text-white font-semibold text-[0.813rem]">
                  {date.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

};

export default TrendContainer;
