import Sidebar from "../../components/chat/Sidebar";
import bg from "../../assets/images/image.png";
import { Outlet} from "react-router-dom";
import { Content } from "antd/es/layout/layout";

const OceanLayout = () => {
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

      <Content className="w-full h-full p-2 overflow-scroll relative z-10">
        <Outlet />
      </Content>
    </div>
  );
};

export default OceanLayout;
