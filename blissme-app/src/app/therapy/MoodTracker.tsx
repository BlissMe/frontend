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
import { submitMood, fetchTodayMood } from "../../services/MoodTracker";

const MoodTracker = () => {
  const logIsVisible = useVisibleStore((state) => state.logIsVisible);
  const setLogIsVisible = useVisibleStore((state) => state.setLogIsVisible);

  const [phase, setPhase] = useState(0);
  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMood] = useState<any>(null);

  // Load today's mood
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const record = await fetchTodayMood();
      setTodayMood(record);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubmitMood = async (
    mood: string,
    sleepHours: string,
    description: string,
    tags: string[] = []
  ) => {
    console.group("📝 Debug: Submitting Mood");
    console.log("Mood:", mood);
    console.log("Sleep Hours:", sleepHours);
    console.log("Description:", description);
    console.groupEnd();

    try {
      const res = await submitMood(mood, sleepHours, description, tags);
      if (res.success) {
        setLogIsVisible(false);
        const today = await fetchTodayMood();

        setTodayMood(today);
      } else {
        alert("Error logging mood: " + res.error);
      }
    } catch (err) {
      alert("Error logging mood. Check console for details.");
    }
  };
  console.log("todayMood in Dashboard:", todayMood);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600 text-lg">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-8 md:pt-10 pb-20 relative flex flex-col items-center">
      <main className="w-[91.47%] md:w-[91.665%] max-w-[73.125rem] mt-12 md:mt-16 flex flex-col items-center">
        {/* Show log button if no mood logged today */}
        {/* <form
          className={`justify-center my-12 lg:my-16 ${
            todayMood ? "hidden" : "flex"
          }`} */}
        <form
          className={`justify-center my-12 lg:my-16 `}
          onSubmit={(e) => {
            e.preventDefault();
            setLogIsVisible(true);
          }}
        >
          <Button
            buttonText="Log today's mood"
            py="1rem"
            fontSize="1.25rem"
            lineHeight="140%"
            letterSpacing="0px"
          />
        </form>

        {/* Log modal */}
        {logIsVisible && (
          <DefaultContainer
            py="default"
            setIsVisible={setLogIsVisible}
            setPhase={setPhase}
            backgroundGradient="linear-gradient(180deg, #F5F5FF 72.99%, #E0E0FF 100%)"
          >
            <LogHeader phase={phase} />
            <LogSlider
              phase={phase}
              setPhase={setPhase}
              onSubmit={handleSubmitMood} 
            />
          </DefaultContainer>
        )}
        {/* Today's mood/sleep/reflection */}
        <div
          className={`${
            todayMood ? "flex" : "hidden"
          } w-full flex-col gap-5 mt-12 mb-8 lg:mt-16 lg:flex-row lg:gap-8`}
        >
          <TodayMood todayRecord={todayMood} />

          <div className="flex flex-col gap-5 lg:w-[39.1%] lg:justify-between">
            <TodaySleep todayRecord={todayMood} />
            <TodayReflection todayRecord={todayMood} />
          </div>
        </div>

        {/* Trends */}
        <div className="flex flex-col w-full gap-8 min-[780px]:flex-row">
          <UserResultContainer />
          <TrendContainer />
        </div>
      </main>
    </div>
  );
};

export default MoodTracker;
