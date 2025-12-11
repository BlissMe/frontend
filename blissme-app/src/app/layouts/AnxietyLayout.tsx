import Sidebar from "../../components/chat/Sidebar";
import bg from "../../assets/images/bg-zen.jpg";
import { Content } from "antd/es/layout/layout";
import { motion } from "framer-motion";

const flowers = ["🌸", "🌺", "🌼", "💮"];

const AnxietyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="w-screen h-screen flex overflow-hidden relative bg-[#0D1A1A]"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Floating flowers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => {
          const size = Math.random() * 30 + 20; // 20-50px
          const left = Math.random() * 100; // % of screen width
          const duration = Math.random() * 8 + 5; // 5-13s
          const delay = Math.random() * 5; // staggered start
          const flower = flowers[Math.floor(Math.random() * flowers.length)];

          return (
            <motion.div
              key={i}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "-10%", opacity: 1 }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
              className="absolute"
              style={{
                left: `${left}%`,
                fontSize: `${size}px`,
              }}
            >
              {flower}
            </motion.div>
          );
        })}
      </div>

      <Content className="w-full h-full justify-center items-center flex z-10">
        {children}
      </Content>
    </div>
  );
};

export default AnxietyLayout;
