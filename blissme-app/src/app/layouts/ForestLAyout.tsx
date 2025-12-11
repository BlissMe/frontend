import Sidebar from "../../components/chat/Sidebar";
import bg from "../../assets/images/b6.jpeg";
import { Outlet } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import { motion } from "framer-motion";

const ForestLayout = () => {
  const leaves = [
    { icon: "🍃", color: "text-green-400" },
    { icon: "🌿", color: "text-green-500" },
    { icon: "🍃", color: "text-green-600" },
  ];

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

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => {
          const size = Math.random() * 25 + 15; // 15-40px
          const left = Math.random() * 100; // % horizontal
          const duration = Math.random() * 15 + 20; // 20-35s slower float
          const delay = Math.random() * 5;
          const leaf = leaves[Math.floor(Math.random() * leaves.length)];

          return (
            <motion.div
              key={i}
              initial={{ y: window.innerHeight, opacity: 0, rotate: 0 }}
              animate={{ y: -50, opacity: 1, rotate: Math.random() * 360 }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
              className={`absolute ${leaf.color}`}
              style={{
                left: `${left}%`,
                fontSize: `${size}px`,
              }}
            >
              {leaf.icon}
            </motion.div>
          );
        })}
      </div>

      <Content className="w-full h-full p-2 overflow-scroll relative z-10">
        <Outlet />
      </Content>
    </div>
  );
};

export default ForestLayout;
