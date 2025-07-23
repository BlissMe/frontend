import React, { useState } from 'react';
import { Button } from 'antd';
import logo from "../../assets/images/logo.png";
import heart from "../../assets/images/heart.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPreferencesSuccess } from '../../redux/reducers/userReducer';
import { setUserPreferences } from '../../redux/actions/userActions';
import { RootState, AppDispatch } from '../../redux/store';

const InputMode = () => {
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const nickname = useSelector((state: RootState) => state.user.nickname);
    const virtualCharacter = useSelector((state: RootState) => state.user.virtualCharacter);

    const handleNext = () => {
        if (!selectedMode) {
            alert("Please select the input mode!");
            return;
        }

        dispatch(setPreferencesSuccess({
            nickname,
            virtualCharacter,
            inputMode: selectedMode
        }));

        dispatch(setUserPreferences(nickname, virtualCharacter, selectedMode));

        console.log("Input mode selected:", selectedMode);

        if (selectedMode === "Voice") {
            navigate("/chat/voice", { replace: true });
        } else if (selectedMode === "Text") {
            navigate("/mood");
        }
        // navigate('/input-mode');
    };

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
                                {["Voice", "Text"].map((mode) => (
                                    <div
                                        key={mode}
                                        onClick={() => setSelectedMode(mode)}
                                        className={`flex flex-col items-center justify-center w-20 h-10 bg-white bg-opacity-50 rounded-lg p-2 shadow-md transition-transform cursor-pointer hover:scale-105
        ${selectedMode === mode ? 'border-2 border-[#1B5E3A]' : 'border border-transparent'}
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
                    onClick={handleNext}
                    className="bg-[#4B9B6E] hover:bg-[#1B5E3A] text-white border-none shadow-md"
                >
                    Start
                </Button>
            </div>
        </div>
    );
};

export default InputMode;
