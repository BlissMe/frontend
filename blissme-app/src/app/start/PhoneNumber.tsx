import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface OtpResponse {
  version: string;
  statusCode: string;
  referenceNo: string;
  statusDetail: string;
}

const PhoneNumber: React.FC = () => {
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

    try {
      const response = await axios.post<OtpResponse>(`${API_URL}/mspace/otp-send`, {
        subscriberId: `tel:94${phone.slice(1)}`,
        applicationHash: "default_hash"
      });
      console.log("Checking",response)

      const { referenceNo } = response.data;

      navigate("/otp-verify", { state: { phone, referenceNo } });

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Enter Your Phone Number</h2>

      <input
        type="text"
        placeholder="e.g., 0771234567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
      />
{/*       {error && <p className="text-red-500 mb-2">{error}</p>}
 */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {loading ? "Sending..." : "Send Verification Code"}
      </button>
    </div>
  );
};

export default PhoneNumber;
