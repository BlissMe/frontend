import backgroundImage from "../../assets/images/bgnew.jpeg";
import { Typography, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function MoodTrackerMain() {
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
          <Button
            type="primary"
            size="large"
            icon={<SmileOutlined />}
            className="!bg-gradient-to-r !from-green-500 !to-emerald-600 hover:!from-green-600 hover:!to-emerald-700 !rounded-full !px-8 !py-5 !shadow-lg transition-transform transform hover:scale-105"
          >
            Log Today’s Mood
          </Button>
        </div>
      </div>
    </div>
  );
}
