import { Typography } from "antd";
import Button from "../../components/therapy/Button";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, SmileOutlined } from "@ant-design/icons";
import { useVisibleStore } from "../../store/useVisibleStore";
import { useEffect, useState } from "react";
import { fetchTodayMood } from "../../services/MoodTracker";

const { Title, Text } = Typography;

export default function MoodTrackerMain() {
  const navigate = useNavigate();
  const setLogIsVisible = useVisibleStore((state) => state.setLogIsVisible);
  const [todayMood, setTodayMood] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const today = await fetchTodayMood();
      if (today) setTodayMood(today);
    })();
  }, []);
  return (
    <div className="flex flex-col justify-between items-center  text-center px-6 py-10">
      <div className="mt-8">
        <Title
          level={1}
          className="!text-4xl md:!text-5xl !font-extrabold !text-green-900 drop-shadow mb-4"
        >
          <span className="block mb-2">Track Your Mood,</span>
          <span className="block">Grow with Positivity</span>
        </Title>

        <div className="!max-w-3xl mx-auto !text-lg md:!text-xl !leading-relaxed tracking-wide font-bold">
          <Text italic className="!font-serif !text-green-900">
            Every day brings new feelings — learning to notice them is the first
            step toward balance.
          </Text>
          <Text italic className="!block mt-3 !font-serif !text-green-800">
            Use this space to reflect, grow, and embrace your emotional journey
            with kindness. 🌿
          </Text>
        </div>
        <div className="mt-8">
          {!todayMood ? (
            <form
              className="justify-center my-12 lg:my-16 flex"
              onSubmit={(e) => {
                e.preventDefault();
                setLogIsVisible(true);
                navigate("/mood/step1");
              }}
            >
              <Button
                buttonText="Log Today’s Mood"
                py="20px"
                fontSize="18px"
                lineHeight="28px"
                letterSpacing="0.5px"
                icon={<SmileOutlined />}
                className="!h-10 !bg-gradient-to-r !from-green-500 !to-emerald-600 hover:!from-green-600 hover:!to-emerald-700 !rounded-full !px-6 !shadow-lg text-white"
              />
            </form>
          ) : (
            <Button
              buttonText="View Your Mood Trcker"
              py="10px"
              fontSize="18px"
              lineHeight="28px"
              letterSpacing="0.5px"
              icon={<EyeOutlined />}
              className="!h-10 !bg-gradient-to-r !from-green-500 !to-emerald-600 hover:!from-green-600 hover:!to-emerald-700 !rounded-full !px-6 !shadow-lg text-white"
              onClick={() => navigate("/dash/mood-tracker")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
