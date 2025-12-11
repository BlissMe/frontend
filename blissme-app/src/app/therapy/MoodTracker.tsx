import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserResultContainer from "../../components/therapy/UserResultContainer";
import TrendContainer from "../../components/therapy/TrendContainer";
import TodayMood from "../../components/therapy/TodayMood";
import TodaySleep from "../../components/therapy/TodaySleep";
import TodayReflection from "../../components/therapy/TodayReflection";
import { fetchTodayMood, fetchAllMoods } from "../../services/MoodTracker";

const MoodTracker = () => {
  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMood] = useState<any>(null);
  const [allMoodRecords, setAllMoodRecords] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const loadData = async () => {
    setLoading(true);
    const today = await fetchTodayMood();
    setTodayMood(today);

    const allRecords = await fetchAllMoods();
    setAllMoodRecords(allRecords);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600 text-lg">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-full bg-white/20 backdrop-blur-md rounded-xl p-2 flex flex-col items-center justify-center">
        <div className="relative w-full flex items-center justify-center mb-4">
          <button
            onClick={() => navigate("/chat-new/text")}
            className="
          fixed top-4 right-8 z-50 
          bg-white/15 backdrop-blur-md border border-white/22
        text-black text-sm font-medium px-4 py-2 rounded-xl shadow-lg
          hover:bg-white/20 hover:scale-105 transition-transform duration-200
        "
          >
            ← Back to Chat
          </button>
          <button
            onClick={() => navigate("/dash/mood-tracker")}
            className="p-2 rounded-full  absolute left-36 bg-green-200 text-green-900 hover:bg-green-300 transition"
            aria-label="Back to Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-green-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            className="text-2xl font-semibold text-green-800 text-center"
            style={{ fontFamily: "Merienda, cursive" }}
          >
            My Mood Tracker
          </div>
        </div>
        <main className="w-[91.47%] md:w-[91.665%] max-w-[73.125rem] flex flex-col items-center">
          <div
            className={`${
              todayMood ? "grid" : "hidden"
            } w-full grid-cols-1 gap-5 mt-6 mb-8 lg:grid lg:grid-cols-3`}
          >
            <TodayMood todayRecord={todayMood} />
            <TodaySleep todayRecord={todayMood} />
            <TodayReflection todayRecord={todayMood} />
          </div>

          <div className="flex flex-row w-full gap-10 min-[780px]:flex-row">
            <TrendContainer userMoodRecord={allMoodRecords} />
            <UserResultContainer records={allMoodRecords} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MoodTracker;
