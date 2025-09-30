import { Typography, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import logo from "../../assets/images/logoShort.png";
import ProfileDropdown from "../profile/Dropdown";
import { useCharacterContext } from "../../app/context/CharacterContext";
const { Text, Title } = Typography;

const Navbar = () => {
  const { nickname } = useCharacterContext();
  
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  const greeting = getGreeting();

  const firstName = nickname?.split(" ")[0] || "Friend";

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src={logo} alt="App Logo" className="h-8 w-8" />
        <Title level={4} className="!mb-0 text-green-700 dark:text-white">
          Blissme
        </Title>
      </div>
      <div className="flex gap-2 text-center items-center">
        <Text className="text-sm font-medium whitespace-nowrap text-green-800">
          Hello, {firstName}!
        </Text>
        <div className="text-base font-bold text-green-800">{greeting}</div>
      </div>

      <div className="flex items-center gap-4">
        <Tooltip title="Learn more about how this app helps you">
          <span className="flex items-center">
            <InfoCircleOutlined className="text-xl text-green-700" />
          </span>
        </Tooltip>
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default Navbar;
