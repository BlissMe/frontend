import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

const { Sider, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout className="w-full flex flex-row h-screen">
      <Sider
        width={250}
        className={
          "visible sider !bg-bgColorOne !max-w-[230px] !min-w-[230px] !w-[230px]"
        }
      >
        <Sidebar />
      </Sider>

      <Layout className="flex-1 h-screen">
        <Content className="w-full h-full p-2 overflow-scroll">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
