import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LayeredBackground } from "animated-backgrounds";
import logo from "../../assets/images/logo.png";
import { Button } from "antd";
import { setLocalStorageData } from "../../helpers/Storage";

interface OtpResponse {
  version: string;
  statusCode: string;
  referenceNo: string;
  statusDetail: string;
}

const PhoneNumber: React.FC = () => {
  const layers = [
    { animation: "starryNight", opacity: 0.7, blendMode: "normal", speed: 0.3 },
    { animation: "cosmicDust", opacity: 0.4, blendMode: "screen", speed: 0.7 },
    { animation: "auroraBorealis", opacity: 0.3, blendMode: "overlay", speed: 1.1 },
  ];

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
  
    setError("");
    setLoading(true);
  
    const subscriberId = `tel:94${phone.slice(1)}`;
  
    try {
      const response = await axios.post<OtpResponse>(
        `${API_URL}/mspace/otp-send`,
        {
          subscriberId,
          applicationHash: "default_hash",
        }
      );
  
      const { referenceNo } = response.data;

      setLocalStorageData("subscriberId", subscriberId);
      setLocalStorageData("phone", phone);
  
      navigate("/otp-verify", { state: { phone, referenceNo } });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to send verification code"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center relative">
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

        <h3 className="text-black text-xl md:text-2xl mb-4">Welcome to BlissMe App</h3>
        <p className="text-gray-700 text-sm mb-6">
          Enter your phone number below to receive a verification code.
        </p>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="e.g., 0701234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-5 text-white font-semibold rounded-lg shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:brightness-90"
            }`}
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumber;
