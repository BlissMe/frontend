import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { LayeredBackground } from "animated-backgrounds";
import { useNotification } from "../context/notificationContext";
import logo from "../../assets/images/logo.png";

// Type for verify OTP API response
interface VerifyResponse {
  version: string;
  statusCode: string;
  subscriptionStatus: string;
  statusDetail: string;
  subscriberId: string;
}

// Type for state passed from PhoneNumber page
interface LocationState {
  phone: string;
  referenceNo: string;
}

const OTPVerify: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const API_URL = process.env.REACT_APP_API_URL;
  const { openNotification } = useNotification();

  // OTP state
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs for inputs
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const token = localStorage.getItem("token");

  // Handle input change
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      //  1. Verify OTP
      const verifyResponse = await axios.post<VerifyResponse>(
        `${API_URL}/mspace/otp-verify`,+
        {
          referenceNo: state.referenceNo,
          otp: enteredOtp,
        }
      );

      if (verifyResponse.data.statusCode === "S1000") {
        openNotification(
          "success",
          `Phone number ${state.phone} verified successfully!`
        );
        navigate("/success");
      } else {
        setError(verifyResponse.data.statusDetail);
      }

      // // 2. Save subscriber
      // await axios.post(
      //   `${API_URL}/mspace/save-subscriber`,
      //   {
      //     subscriberId,
      //     subscriptionStatus,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Layered Background configuration
  const layers = [
    { animation: "starryNight", opacity: 0.7, blendMode: "normal", speed: 0.3 },
    { animation: "cosmicDust", opacity: 0.4, blendMode: "screen", speed: 0.7 },
    {
      animation: "auroraBorealis",
      opacity: 0.3,
      blendMode: "overlay",
      speed: 1.1,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <LayeredBackground layers={layers} />
        <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 opacity-40"></div>
      </div>

      {/* Card */}
      <div className="z-10 bg-white/20 backdrop-blur-xl rounded-3xl p-10 w-[90%] max-w-lg text-center shadow-2xl border border-white/30 relative transition-all duration-300 ease-in-out hover:shadow-xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 text-green-600 font-medium"
        >
          ← Back
        </button>
        <div className="flex flex-col items-center mb-0">
          <img
            src={logo}
            alt="BlissMe Logo"
            className="w-32 h-10 object-contain"
          />
        </div>
        <h2 className="text-[20px] font-semibold text-center pb-5">
          Enter verification code
        </h2>

        <p className="text-center text-gray-700 text-sm mb-3">
          We have sent a 6-digit verification code to your phone number.
          <br />
          Please enter the code to continue.
        </p>

        {/* <p className="text-center text-red-500 text-xs mb-4">
          OTP will be cancelled after 3 wrong attempts*
        </p> */}

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="off"
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:brightness-90"
          }`}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Didn’t receive the code?{" "}
          <span className="text-green-600 cursor-pointer">Resend</span>
        </p>
      </div>
    </div>
  );
};

export default OTPVerify;
