import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import bgImage from "../../assets/images/tile.jpg";

const { Sider, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout className="w-full flex flex-row h-screen">
      <Sider
        width={250}
          className="visible sider !bg-green-900 !max-w-[230px] !min-w-[230px] !w-[230px]"

      >
        <Sidebar />
      </Sider>

      <Layout
        className="w-full flex flex-row h-screen bg-cover bg-center bg-gradient-to-b from-[#FFFFFF] to-[#5FB57F]"
        /* style={{
          backgroundImage: `url(${bgImage})`,
        }} */
      >
        <Content className="w-full h-full p-2 overflow-scroll">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
