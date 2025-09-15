//import { useAuth } from "../context/AuthContext";
import { useUserDataStore } from "../../store/useUserDataStore";
import VisualMoodBar from "./VisualMoodBar";

const TrendContainer = () => {
  const userMoodRecord = useUserDataStore((state:any) => state.userMoodRecord);

  const recordDates = userMoodRecord.map((day:any) => day.data);
  const numberOfDates = 11;
  const missingNumberDates = numberOfDates - recordDates.length;
  const formattedDates = userMoodRecord.map((day:any) => {
    const date = new Date(`${day.data}T00:00:00`); // cria objeto Date
    const dayNumber = date.getDate(); // número do dia
    const monthName = date.toLocaleString("en-US", { month: "long" }); // nome do mês em inglês
    return { day: dayNumber, month: monthName };
  });
  const missingDates: { day: number; month: string }[] = [];
  if (formattedDates.length > 0) {
    const startDate = new Date(`${recordDates[0]}T00:00:00`);

    for (let i = 1; i <= missingNumberDates; i++) {
      const prevDate = new Date(startDate);
      prevDate.setDate(startDate.getDate() - i); // subtrai i dias
      missingDates.push({
        day: prevDate.getDate(),
        month: prevDate.toLocaleString("en-US", { month: "long" }),
      });
    }

    // Inverte pra ordem cronológica (do mais antigo pro mais recente)
    missingDates.reverse();
  } else {
    // Nenhum registro: gera 11 dias com hoje sendo o último
    const today = new Date();
    for (let i = 10; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      missingDates.push({
        day: date.getDate(),
        month: date.toLocaleString("en-US", { month: "long" }),
      });
    }
  }
  const allDates = [...missingDates, ...formattedDates];

  const paddedDates = allDates.map((item) => ({
    day: item.day.toString().padStart(2, "0"),
    month: item.month,
  }));
  const reverseAllDates = [...paddedDates].reverse();

  const inverseRecords = [...userMoodRecord].reverse();

  return (
    <section className="px-4 py-5 md:px-5 md:py-8 rounded-2xl bg-white w-full flex flex-col border border-blue-100 gap-8 min-[780px]:w-[52%] min-[896px]:w-[57%] lg:w-[62%] min-[73.125rem]:w-full">
      <h3 className="text-neutral-900 font-RedditSans font-bold text-[1.75rem]/[130%] tracking-[-0.019rem] md:text-[2rem]/140%">
        Mood and sleep trends
      </h3>
      <div className="flex flex-row ">
        <div className="flex flex-col gap-10  mr-4">
          <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%] flex gap-1.5 items-center w-[4.25rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="#57577b"
                d="M10 .906c-.031.219-.125.531-.25.688L7.156 4.5H9c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5H5.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.657L7.812 1.5H6a.494.494 0 0 1-.5-.5V.5c0-.25.219-.5.5-.5h3.5c.25 0 .5.25.5.5v.406ZM7.25 8a.76.76 0 0 1 .75.75v.813c-.031.218-.156.53-.313.687L3.876 14H7.5c.25 0 .5.25.5.5v1c0 .281-.25.5-.5.5H1.75a.722.722 0 0 1-.75-.75v-.781c0-.219.125-.531.281-.688L5.094 10H2a.494.494 0 0 1-.5-.5v-1c0-.25.219-.5.5-.5h5.25Zm7.25-1c.25 0 .5.25.5.5v.406c-.031.219-.125.532-.25.688L12.156 11.5H14c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5h-3.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.656L12.813 8.5H11a.494.494 0 0 1-.5-.5v-.5c0-.25.219-.5.5-.5h3.5Z"
              />
            </svg>
            9+ hours
          </span>
          <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%] flex gap-1.5 items-center w-[4.25rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="#57577b"
                d="M10 .906c-.031.219-.125.531-.25.688L7.156 4.5H9c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5H5.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.657L7.812 1.5H6a.494.494 0 0 1-.5-.5V.5c0-.25.219-.5.5-.5h3.5c.25 0 .5.25.5.5v.406ZM7.25 8a.76.76 0 0 1 .75.75v.813c-.031.218-.156.53-.313.687L3.876 14H7.5c.25 0 .5.25.5.5v1c0 .281-.25.5-.5.5H1.75a.722.722 0 0 1-.75-.75v-.781c0-.219.125-.531.281-.688L5.094 10H2a.494.494 0 0 1-.5-.5v-1c0-.25.219-.5.5-.5h5.25Zm7.25-1c.25 0 .5.25.5.5v.406c-.031.219-.125.532-.25.688L12.156 11.5H14c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5h-3.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.656L12.813 8.5H11a.494.494 0 0 1-.5-.5v-.5c0-.25.219-.5.5-.5h3.5Z"
              />
            </svg>
            7-8 hours
          </span>
          <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%] flex gap-1.5 items-center w-[4.25rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="#57577b"
                d="M10 .906c-.031.219-.125.531-.25.688L7.156 4.5H9c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5H5.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.657L7.812 1.5H6a.494.494 0 0 1-.5-.5V.5c0-.25.219-.5.5-.5h3.5c.25 0 .5.25.5.5v.406ZM7.25 8a.76.76 0 0 1 .75.75v.813c-.031.218-.156.53-.313.687L3.876 14H7.5c.25 0 .5.25.5.5v1c0 .281-.25.5-.5.5H1.75a.722.722 0 0 1-.75-.75v-.781c0-.219.125-.531.281-.688L5.094 10H2a.494.494 0 0 1-.5-.5v-1c0-.25.219-.5.5-.5h5.25Zm7.25-1c.25 0 .5.25.5.5v.406c-.031.219-.125.532-.25.688L12.156 11.5H14c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5h-3.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.656L12.813 8.5H11a.494.494 0 0 1-.5-.5v-.5c0-.25.219-.5.5-.5h3.5Z"
              />
            </svg>
            5-6 hours
          </span>
          <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%] flex gap-1.5 items-center w-[4.25rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="#57577b"
                d="M10 .906c-.031.219-.125.531-.25.688L7.156 4.5H9c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5H5.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.657L7.812 1.5H6a.494.494 0 0 1-.5-.5V.5c0-.25.219-.5.5-.5h3.5c.25 0 .5.25.5.5v.406ZM7.25 8a.76.76 0 0 1 .75.75v.813c-.031.218-.156.53-.313.687L3.876 14H7.5c.25 0 .5.25.5.5v1c0 .281-.25.5-.5.5H1.75a.722.722 0 0 1-.75-.75v-.781c0-.219.125-.531.281-.688L5.094 10H2a.494.494 0 0 1-.5-.5v-1c0-.25.219-.5.5-.5h5.25Zm7.25-1c.25 0 .5.25.5.5v.406c-.031.219-.125.532-.25.688L12.156 11.5H14c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5h-3.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.656L12.813 8.5H11a.494.494 0 0 1-.5-.5v-.5c0-.25.219-.5.5-.5h3.5Z"
              />
            </svg>
            3-4 hours
          </span>
          <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%] flex gap-1.5 items-center w-[4.25rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="#57577b"
                d="M10 .906c-.031.219-.125.531-.25.688L7.156 4.5H9c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5H5.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.657L7.812 1.5H6a.494.494 0 0 1-.5-.5V.5c0-.25.219-.5.5-.5h3.5c.25 0 .5.25.5.5v.406ZM7.25 8a.76.76 0 0 1 .75.75v.813c-.031.218-.156.53-.313.687L3.876 14H7.5c.25 0 .5.25.5.5v1c0 .281-.25.5-.5.5H1.75a.722.722 0 0 1-.75-.75v-.781c0-.219.125-.531.281-.688L5.094 10H2a.494.494 0 0 1-.5-.5v-1c0-.25.219-.5.5-.5h5.25Zm7.25-1c.25 0 .5.25.5.5v.406c-.031.219-.125.532-.25.688L12.156 11.5H14c.25 0 .5.25.5.5v.5c0 .281-.25.5-.5.5h-3.5a.494.494 0 0 1-.5-.5v-.406c0-.188.094-.5.219-.656L12.813 8.5H11a.494.494 0 0 1-.5-.5v-.5c0-.25.219-.5.5-.5h3.5Z"
              />
            </svg>
            0-2 hours
          </span>
        </div>
        <div className="overflow-x-auto overflow-y-hidden whitespace-nowrap flex flex-row-reverse w-full max-w-[626px]">
          <div className="w-[626px] flex flex-col shrink-0 relative">
            <div className="flex flex-col w-full mt-[7px] gap-[52px]">
              <div className="w-full h-[1px] bg-blue-100/[30%]"></div>
              <div className="w-full h-[1px] bg-blue-100/[30%]"></div>
              <div className="w-full h-[1px] bg-blue-100/[30%]"></div>
              <div className="w-full h-[1px] bg-blue-100/[30%]"></div>
              <div className="w-full h-[1px] bg-blue-100/[30%]"></div>
            </div>
            <div className="absolute w-full flex flex-row-reverse gap-[1.125rem] h-[84%] items-end">
              {inverseRecords.map((record, index) => (
                <VisualMoodBar
                  key={index}
                  hours={record.horas_sono}
                  mood={record.humor}
                  reflection={record.descricao}
                  tags={record.como_se_sentiu}
                  isLastFour={index >= 7}
                />
              ))}
            </div>
            <div className="flex gap-[1.125rem] flex-row-reverse mt-[55px]">
              <div className="flex flex-col w-10 gap-1.5 items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[0].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[0].day}
                </span>
              </div>
              <div className="flex flex-col w-10 gap-1.5  items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[1].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[1].day}
                </span>
              </div>
              <div className="flex flex-col w-10 gap-1.5 items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[2].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[2].day}
                </span>
              </div>
              <div className="flex flex-col w-10 gap-1.5 items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[3].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[3].day}
                </span>
              </div>
              <div className="flex flex-col w-10 gap-1.5 items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[4].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[4].day}
                </span>
              </div>
              <div className="flex flex-col w-10 gap-1.5 items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[5].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[5].day}
                </span>
              </div>
              <div className="flex flex-col w-10 gap-1.5 items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[6].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[6].day}
                </span>
              </div>
              <div className="flex flex-col w-10 gap-1.5 items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[7].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[7].day}
                </span>
              </div>
              <div className="flex flex-col w-10 gap-1.5 items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[8].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[8].day}
                </span>
              </div>
              <div className="flex flex-col w-10 gap-1.5 items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[9].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[9].day}
                </span>
              </div>
              <div className="flex flex-col w-10  gap-1.5 items-center">
                <span className="font-RedditSans text-neutral-600 text-[0.75rem]/[110%]">
                  {reverseAllDates[10].month}
                </span>
                <span className="font-RedditSans text-neutral-900 font-semibold text-[0.813rem]">
                  {reverseAllDates[10].day}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendContainer;
