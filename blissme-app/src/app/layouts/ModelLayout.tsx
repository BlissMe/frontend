import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const ModelLayout = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Layout>
        <Outlet />
      </Layout>
    </div>
  );
};

export default ModelLayout;
