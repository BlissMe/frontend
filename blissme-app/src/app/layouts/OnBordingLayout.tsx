import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const OnBordingLayout = () => {
  return (
    <Layout className="w-full flex flex-row h-screen">
      <Layout className="flex-1 h-screen">
        <Content className="w-full h-full p-2 overflow-scroll">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default OnBordingLayout;
