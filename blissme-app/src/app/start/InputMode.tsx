import React, { useState } from 'react';
import { Button } from 'antd';
import logo from "../../assets/images/logo.png";
import heart from "../../assets/images/heart.png";

const InputMode = () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-20 bg-[#BDF2D0]"></div>

            <div className="z-10 bg-[#BDF2D0] bg-opacity-10 backdrop-blur-md rounded-2xl p-8 w-[90%] max-w-md text-center shadow-xl border border-white/20 relative">
                <div className="flex flex-col items-center mb-0">
                    <img src={logo} alt="BlissMe Logo" className="w-32 h-10 object-contain" />
                </div>

                <h3 className="text-black text-xl md:text-2xl mb-2">Welcome to BlissMe App</h3>

                <div className="relative flex flex-col items-center w-full max-w-md mx-auto">
                    <img
                        src={heart}
                        alt="Heart"
                        className="w-34 h-16 animate-wiggle animate-infinite"
                    />

                    <div className=" bottom-0 w-[90%] bg-[#DCF2DE] shadow-md rounded-lg px-4 py-3 translate-y-[-15%] items-center">
                        <label className="text-gray-600 text-sm text-center block max-w-full mb-2">
                            Choose input method
                        </label>

                        <div className="flex justify-center p-2">
                            <div className="flex gap-4 px-2">
                                {["Voice", "Text"].map((mode, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedIndex(index)}
                                        className={`flex flex-col items-center justify-center w-20 h-10 bg-white bg-opacity-50 rounded-lg p-2 shadow-md transition-transform cursor-pointer hover:scale-105
          ${selectedIndex === index ? 'border-2 border-[#1B5E3A]' : 'border border-transparent'}
        `}
                                    >
                                        <span className="text-sm font-medium text-gray-700">{mode}</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>
                </div>

                <Button
                    type="default"
                    className="bg-[#4B9B6E] hover:bg-[#1B5E3A] text-white border-none shadow-md"
                >
                    Start
                </Button>
            </div>
        </div>
    );
};

export default InputMode;
