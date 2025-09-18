import { useNavigate } from "react-router-dom";
import { useVisibleStore } from "../../store/useVisibleStore";
import DefaultContainer from "../../components/therapy/DefaultContainer";
import { useState } from "react";
import LogSlider from "../../components/therapy/LogSlider";
import LogHeader from "../../components/therapy/LogHeader";
import {
  fetchAllMoods,
  fetchTodayMood,
  submitMood,
} from "../../services/MoodTracker";

const LogMood = () => {
  const logIsVisible = useVisibleStore((state) => state.logIsVisible);
  const setLogIsVisible = useVisibleStore((state) => state.setLogIsVisible);
  const [phase, setPhase] = useState(0);

  const [todayMood, setTodayMood] = useState<any>(null);
  const [allMoodRecords, setAllMoodRecords] = useState<any[]>([]);
  const navigate = useNavigate();
  const handleLogoClick = () => navigate("/home");
  const handleSubmitMood = async (
    mood: string,
    sleepHours: string,
    description: string,
    tags: string[] = []
  ) => {
    try {
      const res = await submitMood(mood, sleepHours, description, tags);
      if (res.success) {
        setLogIsVisible(false);

        const today = await fetchTodayMood();
        setTodayMood(today);

        const allRecords = await fetchAllMoods();
        setAllMoodRecords(allRecords);
      } else {
        alert("Error logging mood: " + res.error);
      }
    } catch (err) {
      alert("Error logging mood. Check console for details.");
    }
  };
 return (
  <div className="flex justify-center h-screen">

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
  </div>
);

};

export default LogMood;
