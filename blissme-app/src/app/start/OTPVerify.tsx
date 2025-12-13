import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

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

  // Submit OTP
  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post<VerifyResponse>(
        `${API_URL}/mspace/otp-verify`,
        {
          referenceNo: state.referenceNo,
          otp: enteredOtp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.statusCode === "S1000") {
        alert(`Phone number ${state.phone} verified successfully!`);
        navigate("/dashboard");
      } else {
        setError(response.data.statusDetail || "OTP verification failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-200 px-4">
      <div
        className="relative p-6 md:px-10 md:py-7 bg-white rounded-lg w-full sm:w-[400px] md:w-[500px]"
        style={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 text-purple-600 font-medium"
        >
          ← Back
        </button>

        {/* Title */}
        <h2 className="flex items-center justify-center text-[20px] font-semibold pb-5">
          Enter verification code
        </h2>

        {/* Description */}
        <p className="text-center text-gray-700 text-sm mb-3">
          We have sent a 6-digit verification code to your phone number.
          <br />
          Please enter the code to continue.
        </p>

        <p className="text-center text-red-500 text-xs mb-4">
          OTP will be cancelled after 3 wrong attempts*
        </p>

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
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          className={`w-full py-2 mt-2 text-white font-semibold rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Didn’t receive the code?{" "}
          <span className="text-purple-600 cursor-pointer">Resend</span>
        </p>
      </div>
    </div>
  );
};

export default OTPVerify;
