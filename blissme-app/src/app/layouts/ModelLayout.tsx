import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import LiveLoader from "../../components/loader/LiveLoader";

const ModelLayout = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* <LiveLoader /> */}
      <Layout>

        <Outlet />
      </Layout>
    </div>
  );
};

export default ModelLayout;
