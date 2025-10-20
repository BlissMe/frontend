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
const Medicine = () => {
  const layers = [
    { animation: "starryNight", opacity: 0.7, speed: 0.3 },
    { animation: "cosmicDust", opacity: 0.4, speed: 0.7 },
    { animation: "auroraBorealis", opacity: 0.3, speed: 1.1 },
  ];

  const navigate = useNavigate();
  const { openNotification } = useNotification();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const saved = getLocalStoragedata("takesMedicine");
    if (saved) setSelectedOption(saved);
  }, []);

  const handleMedicineSelection = async (choice: string | null) => {
    try {
      setIsLoading(true);
      const token = getLocalStoragedata("token");
      const response = await axios.post<MedicineResponse>(
        `${API_URL}/api/blissme/medicine-status`,
        choice ? { takesMedicine: choice } : {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      openNotification("success", response.data.message);
      setLocalStorageData("takesMedicine", choice || "skipped");

      // Navigate to next page (change route if needed)
      setTimeout(() => {
        navigate("/mode/input-mode");
      }, 1000);
    } catch (error: any) {
      openNotification(
        "error",
        error.response?.data?.message || "Failed to save medicine status"
      );
    } finally {
      setIsLoading(false);
    }
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
          <Progress percent={100} showInfo={false} strokeColor="#8FD19E" />
          <p className="text-gray-600 text-sm mt-2">Step 2 of 2</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Are you taking medicine for depression?
        </h2>
        <p className="text-gray-600 mb-8 text-sm">
          (You can skip this question if you prefer not to share)
        </p>

        <div className="flex flex-col gap-4">
          <Button
            type={selectedOption === "yes" ? "primary" : "default"}
            size="large"
            loading={isLoading}
            onClick={() => handleMedicineSelection("yes")}
            className={`rounded-xl py-5 font-medium transition-all ${
              selectedOption === "yes"
                ? "bg-green-500 text-white border-none"
                : "hover:bg-green-100"
            }`}
          >
            Yes, I do
          </Button>

          <Button
            type={selectedOption === "no" ? "primary" : "default"}
            size="large"
            loading={isLoading}
            onClick={() => handleMedicineSelection("no")}
            className={`rounded-xl py-5 font-medium transition-all ${
              selectedOption === "no"
                ? "bg-red-400 text-white border-none"
                : "hover:bg-red-100"
            }`}
          >
            No, I don’t
          </Button>

          <Button
            size="large"
            onClick={() => handleMedicineSelection(null)}
            className="rounded-xl py-5 bg-white/60 hover:bg-white text-gray-700 font-medium transition-all"
          >
            Skip for now
          </Button>
        </div>

        <div className="flex justify-between mt-10 text-sm text-gray-600">
          <button
            onClick={() => navigate("/mode/level")}
            className="underline hover:text-gray-800 transition"
          >
            <span className="text-black font-semibold text-base cursor-pointer">
              ← Back
            </span>
          </button>
          <button
            onClick={() => handleMedicineSelection(null)}
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

export default Medicine;
