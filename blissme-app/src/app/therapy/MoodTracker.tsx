import { useEffect, useState } from "react";
import DefaultContainer from "../../components/therapy/DefaultContainer";
import Button from "../../components/therapy/Button";
import LogHeader from "../../components/therapy/LogHeader";
import LogSlider from "../../components/therapy/LogSlider";
import UserResultContainer from "../../components/therapy/UserResultContainer";
import TrendContainer from "../../components/therapy/TrendContainer";
import TodayMood from "../../components/therapy/TodayMood";
import TodaySleep from "../../components/therapy/TodaySleep";
import TodayReflection from "../../components/therapy/TodayReflection";
import { useVisibleStore } from "../../store/useVisibleStore";
import { fetchTodayMood, fetchAllMoods } from "../../services/MoodTracker";

const MoodTracker = () => {
  const logIsVisible = useVisibleStore((state) => state.logIsVisible);
  const setLogIsVisible = useVisibleStore((state) => state.setLogIsVisible);

  const [phase, setPhase] = useState(0);
  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMood] = useState<any>(null);
  const [allMoodRecords, setAllMoodRecords] = useState<any[]>([]);

  // Load today's mood
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const today = await fetchTodayMood();
      setTodayMood(today);

      const allRecords = await fetchAllMoods();
      setAllMoodRecords(allRecords);

      setLoading(false);
    };
    loadData();
  }, []);

  console.log("todayMood in Dashboard:", todayMood);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600 text-lg">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      <main className="w-[91.47%] md:w-[91.665%] max-w-[73.125rem] mt-12 md:mt-16 flex flex-col items-center">
        <div
          className={`${
            todayMood ? "grid" : "hidden"
          } w-full grid-cols-1 gap-5 mt-12 mb-8 lg:mt-16 lg:grid lg:grid-cols-3`}
        >
          <TodayMood todayRecord={todayMood} />
          <TodaySleep todayRecord={todayMood} />
          <TodayReflection todayRecord={todayMood} />
        </div>

        {/* Trends */}
        <div className="flex flex-row w-full gap-10 min-[780px]:flex-row">
          <TrendContainer userMoodRecord={allMoodRecords} />

          <UserResultContainer records={allMoodRecords} />
        </div>
      </main>
    </div>
  );
};

export default MoodTracker;
