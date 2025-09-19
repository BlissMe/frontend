import type { Dispatch, SetStateAction } from "react";
import { useUserDataStore } from "../../store/useUserDataStore";
import { useNavigate } from "react-router-dom"; 

type DefaultContainerProps = {
  children: React.ReactNode;
  py: string;
  setIsVisible: (value: boolean) => void;
  setPhase?: Dispatch<SetStateAction<number>>;
  backgroundGradient?: string;
  navigateTo?: string; 
};

const DefaultContainer = ({
  children,
  py,
  setIsVisible,
  setPhase,
  backgroundGradient,
  navigateTo,
}: DefaultContainerProps) => {
  const paddingYclassname =
    py === "settings" ? "py-10 md:py-12" : "py-8 md:py-12";

  const setLogData = useUserDataStore((state) => state.setLogData);
  const setLogError = useUserDataStore((state) => state.setLogError);

  const navigate = useNavigate(); 

  return (
    <div
      style={{
        background: backgroundGradient
          ? "linear-gradient(180deg, #F5F5FF 72.99%, #E0E0FF 100%)"
          : "",
      }}
      className={`flex absolute flex-col px-8 rounded-2xl mt-[4.58rem] md:mt-6 bg-white w-[89.33%] max-w-[37.5rem] gap-6 md:gap-8 z-30 top-0 ${paddingYclassname}`}
    >
      <svg
        onClick={() => {
          setIsVisible(false);

          if (setPhase) {
            setPhase(0);
            setLogData({
              humor: "",
              horasSono: "",
              descricao: "",
              tags: [],
            });
            setLogError(false);
          }

          if (navigateTo) {
            navigate(navigateTo); 
          }
        }}
        className="absolute top-[17.5px] right-[16.5px] md:top-[30px] md:right-[30px] w-[10px] h-[10px] md:w-[15px] md:h-[15px] cursor-pointer"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.72656 7.47656L14.7891 12.5391C15.0703 12.8203 15.0703 13.3359 14.7891 13.6172L13.6172 14.7891C13.3359 15.0703 12.8203 15.0703 12.5391 14.7891L7.52344 9.72656L2.46094 14.7891C2.17969 15.0703 1.66406 15.0703 1.38281 14.7891L0.210938 13.6172C-0.0703125 13.3359 -0.0703125 12.8203 0.210938 12.5391L5.27344 7.47656L0.210938 2.46094C-0.0703125 2.17969 -0.0703125 1.66406 0.210938 1.38281L1.38281 0.210938C1.66406 -0.0703125 2.17969 -0.0703125 2.46094 0.210938L7.52344 5.27344L12.5391 0.210938C12.8203 -0.0703125 13.3359 -0.0703125 13.6172 0.210938L14.7891 1.38281C15.0703 1.66406 15.0703 2.17969 14.7891 2.46094L9.72656 7.47656Z"
          fill="#9393B7"
        />
      </svg>

      {children}
    </div>
  );
};

export default DefaultContainer;
