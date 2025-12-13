import React from "react";
import { useNavigate } from "react-router-dom";
import { LayeredBackground } from "animated-backgrounds";
import logo from "../../assets/images/logo.png";

const SubscriptionSuccess: React.FC = () => {
    const navigate = useNavigate();

    const layers = [
        { animation: "starryNight", opacity: 0.7, blendMode: "normal", speed: 0.3 },
        { animation: "cosmicDust", opacity: 0.4, blendMode: "screen", speed: 0.7 },
        { animation: "auroraBorealis", opacity: 0.3, blendMode: "overlay", speed: 1.1 },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center relative px-4">
            <div className="absolute inset-0 z-0">
                <LayeredBackground layers={layers} />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-blue-200 opacity-40"></div>
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

                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 rounded-full p-5 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-green-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                </div>


                <h2 className="text-3xl font-bold mb-3 text-green-700">
                    Subscription Successful!
                </h2>


                <p className="text-gray-700 mb-4 text-base sm:text-lg">
                    🎉 Congratulations! You have successfully unlocked advanced features of your BlissMe app.
                </p>

                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                    You now have access to premium content, personalized notifications, and enhanced tools to make your experience more enjoyable.
                </p>
                <button
                    onClick={() => navigate("/mode/nick-name")}
                    className="py-3 px-8 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition-all duration-200"
                >
                    Explore Blissme

                </button>
            </div>
        </div>
    );
};

export default SubscriptionSuccess;
