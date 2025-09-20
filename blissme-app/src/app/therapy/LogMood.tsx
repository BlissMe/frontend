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
import { useNotification } from "../context/notificationContext";

const LogMood = () => {
  const setLogIsVisible = useVisibleStore((state) => state.setLogIsVisible);
  const [phase, setPhase] = useState(0);

  const [todayMood, setTodayMood] = useState<any>(null);
  const [allMoodRecords, setAllMoodRecords] = useState<any[]>([]);
  const navigate = useNavigate();
  const { openNotification } = useNotification();

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
        navigate("/dash/mood-tracker", { replace: true });

        const today = await fetchTodayMood();
        setTodayMood(today);

        const allRecords = await fetchAllMoods();
        setAllMoodRecords(allRecords);

        openNotification("success", "Mood logged successfully!");
      } else {
        openNotification("error", res.error);
      }
    } catch (err) {
      openNotification(
        "error",
        "Error logging mood. Check console for details."
      );
    }
  };

  return (
    <div className="flex justify-center h-screen">
      <DefaultContainer
        py="default"
        setIsVisible={setLogIsVisible}
        setPhase={setPhase}
        backgroundGradient="linear-gradient(180deg, #F5F5FF 72.99%, #E0E0FF 100%)"
        navigateTo="/dash/mood-tracker"
      >
        <LogHeader phase={phase} setPhase={setPhase} />

        <LogSlider
          phase={phase}
          setPhase={setPhase}
          onSubmit={handleSubmitMood}
        />
      </DefaultContainer>
    </div>
  );
};

export default LogMood;
