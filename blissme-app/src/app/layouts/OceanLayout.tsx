import Sidebar from "../../components/chat/Sidebar";
import bg from "../../assets/images/chat-bg.png";
import { Outlet } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const OceanLayout = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => navigate("/home");

  return (
    <div
      className="w-screen h-screen flex overflow-hidden relative bg-[#0D1A1A]"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Sidebar />
      <div
        onClick={handleLogoClick}
        className="absolute top-4 left-8 md:left-20 cursor-pointer z-20"
        style={{ width: "auto", height: "40px" }}
      >
        <img src={logo} alt="Logo" className="h-10 w-auto" />
      </div>

      <Content className="w-full h-full p-2 overflow-scroll relative z-10">
        <Outlet />
      </Content>
    </div>
  );
};

export default OceanLayout;
