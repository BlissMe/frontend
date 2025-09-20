import Sidebar from "../../components/chat/Sidebar";
import backgroundImage from "../../assets/images/bg_game.png";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { Content } from "antd/es/layout/layout";

const GameLayout = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => navigate("/home");

  return (
    <div
      className="w-screen h-screen flex overflow-hidden relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Sidebar />
      <div
        onClick={handleLogoClick}
        className="absolute top-4 left-20 cursor-pointer z-20"
        style={{ width: "auto", height: "40px" }}
      >
        <img src={logo} alt="Logo" className="h-10 w-auto" />
      </div>

      <Content className="w-full h-full p-2 overflow-scroll items-center justify-center flex">
        <Outlet />
      </Content>
    </div>
  );
};

export default GameLayout;
