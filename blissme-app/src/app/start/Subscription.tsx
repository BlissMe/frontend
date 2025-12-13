import React from "react";
import { useNavigate } from "react-router-dom";
import { LayeredBackground } from "animated-backgrounds";
import logo from "../../assets/images/logo.png";

const SubscriptionPrice: React.FC = () => {
  const navigate = useNavigate();

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
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <LayeredBackground layers={layers} />
        <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 opacity-40"></div>
      </div>

      {/* Card */}
      <div className="z-10 bg-white/20 backdrop-blur-xl rounded-3xl p-10 w-[95%] max-w-4xl text-center shadow-2xl border border-white/30 relative">
        {/* Back */}
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

        {/* Title */}
        <h2 className="text-[22px] font-semibold pb-3">Choose Your Plan</h2>

        <p className="text-gray-700 text-sm mb-8">
          Select a plan that fits your needs. Upgrade anytime.
        </p>

        {/* PLANS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FREE PLAN */}
          <div className="bg-white/50 rounded-2xl p-6 border border-white/40 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Free Plan
            </h3>

            <p className="text-3xl font-bold text-gray-700 mb-1">$0</p>

            <p className="text-xs text-gray-600 mb-4">forever</p>

            <ul className="text-sm text-gray-700 space-y-2 text-left mb-6">
              <li>✔ Basic features</li>
              <li>✔ Limited access</li>
              <li>✔ No payment required</li>
            </ul>

            <button
              onClick={() => navigate("/mode/input-mode")}
              className="mt-auto w-full py-2 text-gray-800 font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Continue Free
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="bg-white/70 rounded-2xl p-6 border-2 border-green-400 shadow-xl flex flex-col relative">
            {/* Badge */}
            <span className="absolute -top-3 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow">
              RECOMMENDED
            </span>

            <h3 className="text-lg font-semibold text-green-700 mb-1">
              Premium Plan
            </h3>

            <p className="text-4xl font-bold text-green-600 mb-1">$5</p>

            <p className="text-xs text-gray-600 mb-4">per month</p>

            <ul className="text-sm text-gray-700 space-y-2 text-left mb-6">
              <li>✔ All features unlocked</li>
              <li>✔ Personalized recommendations</li>
              <li>✔ Priority notifications</li>
            </ul>

            <button
              onClick={() => navigate("/phone-number")}
              className="mt-auto w-full py-3 text-white font-semibold rounded-lg shadow-md transition bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:brightness-90"
            >
              Go Premium
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Cancel anytime. No hidden charges.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPrice;
