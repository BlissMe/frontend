import { useEffect, useState } from "react";
import { Button, Progress } from "antd";
import logo from "../../assets/images/logo.png";
import heart from "../../assets/images/heart.png";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/notificationContext";
import { LayeredBackground } from "animated-backgrounds";
import {
  getLocalStoragedata,
  setLocalStorageData,
} from "../../helpers/Storage";
import axios from "axios";

interface MedicineResponse {
  message: string;
}

const Level = () => {
  const layers = [
    { animation: "starryNight", opacity: 0.7, speed: 0.3 },
    { animation: "cosmicDust", opacity: 0.4, speed: 0.7 },
    { animation: "auroraBorealis", opacity: 0.3, speed: 1.1 },
  ];

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const navigate = useNavigate();
  const { openNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const saved = getLocalStoragedata("depressionLevel");
    if (saved && saved !== "unknown") setSelectedLevel(saved);
  }, []);

  const handleLevelSelection = async (
    level: string | null,
    navigateNext = false
  ) => {
    try {
      setIsLoading(true);
      const token = getLocalStoragedata("token");
      const response = await axios.post<MedicineResponse>(
        `${API_URL}/api/blissme/depression-level`,
        level ? { depressionLevel: level } : {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      //openNotification("success", response.data.message);
      setLocalStorageData("depressionLevel", level || "unknown");
      setSelectedLevel(level);

      if (navigateNext) {
        navigate("/mode/medicine");
      }
    } catch (error: any) {
      openNotification(
        "error",
        error.response?.data?.message || "Failed to set depression level"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    const savedLevel = getLocalStoragedata("depressionLevel") || selectedLevel;

    if (!savedLevel) {
      openNotification(
        "warning",
        "Please choose a level or skip before continuing."
      );
      return;
    }

    navigate("/mode/medicine");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <LayeredBackground layers={layers} />
      </div>

      <div className="absolute inset-0 bg-[#BDF2D0]/40 backdrop-blur-md z-0" />

      <div className="z-10 bg-white/20 backdrop-blur-xl rounded-3xl p-10 w-[90%] max-w-lg text-center shadow-2xl border border-white/30 relative transition-all duration-300 ease-in-out hover:shadow-xl">
        <div className="flex flex-col items-center mb-5">
          <img
            src={logo}
            alt="BlissMe Logo"
            className="w-36 h-12 object-contain"
          />
        </div>

        <div className="mb-8">
          <Progress percent={50} showInfo={false} strokeColor="#8FD19E" />
          <p className="text-gray-600 text-sm mt-2">Step 1 of 2</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          How would you describe your depression level?
        </h2>
        <p className="text-gray-600 mb-8 text-sm">
          (You can skip if you’re not sure)
        </p>

        <div className="flex flex-col gap-4">
          <Button
            type={selectedLevel === "mild" ? "primary" : "default"}
            size="large"
            loading={isLoading}
            onClick={() => handleLevelSelection("mild", true)}
            className={`rounded-xl py-5 font-medium transition-all ${
              selectedLevel === "mild"
                ? "bg-green-500 text-white border-none"
                : "hover:bg-green-100"
            }`}
          >
            Mild
          </Button>

          <Button
            type={selectedLevel === "moderate" ? "primary" : "default"}
            size="large"
            loading={isLoading}
            onClick={() => handleLevelSelection("moderate", true)}
            className={`rounded-xl py-5 font-medium transition-all ${
              selectedLevel === "moderate"
                ? "bg-yellow-400 text-white border-none"
                : "hover:bg-yellow-100"
            }`}
          >
            Moderate
          </Button>

          <Button
            type={selectedLevel === "severe" ? "primary" : "default"}
            size="large"
            loading={isLoading}
            onClick={() => handleLevelSelection("severe", true)}
            className={`rounded-xl py-5 font-medium transition-all ${
              selectedLevel === "severe"
                ? "bg-red-500 text-white border-none"
                : "hover:bg-red-100"
            }`}
          >
            Severe
          </Button>

          <Button
            size="large"
            onClick={() => handleLevelSelection(null, true)}
            className="rounded-xl py-5 bg-white/60 hover:bg-white text-gray-700 font-medium transition-all"
          >
            Skip for now
          </Button>
        </div>

        <div className="flex justify-end mt-10 text-sm text-gray-600">
          <button
            onClick={handleContinue}
            className="underline hover:text-gray-800 transition"
          >
            <span className="text-black font-semibold text-base cursor-pointer">
              Continue →
            </span>
          </button>
        </div>

        <img
          src={heart}
          alt="Heart"
          className="absolute bottom-5 right-5 w-10 opacity-70 animate-pulse"
        />
      </div>
    </div>
  );
};

export default Level;
