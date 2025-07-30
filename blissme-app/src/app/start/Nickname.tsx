import React, { useState } from 'react';
import { Input, Button } from 'antd';
import heart from "../../assets/images/heart.png";
import logo from "../../assets/images/logo.png";
import bg2 from '../../assets/images/bg2.jpg';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPreferencesSuccess } from '../../redux/reducers/userReducer';
import { LayeredBackground } from 'animated-backgrounds';

const Nickname = () => {
    const [nickname, setNicknameInput] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNext = () => {
        dispatch(setPreferencesSuccess({ nickname, virtualCharacter: 1, inputMode: "" }));
        console.log("Nickname set to:", nickname);
        navigate("/virtual-character");
    };

    const layers = [
        {
            animation: 'starryNight',
            opacity: 0.7,
            blendMode: 'normal',
            speed: 0.3
        },
        {
            animation: 'cosmicDust',
            opacity: 0.4,
            blendMode: 'screen',
            speed: 0.7
        },
        {
            animation: 'auroraBorealis',
            opacity: 0.3,
            blendMode: 'overlay',
            speed: 1.1
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

            {/* Static background image layer */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
            // style={{ backgroundImage: `url(${bg2})` }}
            />

            {/* Animated background layers on top */}
            <div className="absolute inset-0 z-10">
                <LayeredBackground layers={layers} />
            </div>

            {/* Main content container */}
            <div className="z-20 bg-[#BDF2D0] bg-opacity-10 backdrop-blur-md rounded-2xl p-8 w-[90%] max-w-md text-center shadow-xl border border-white/20">
                <div className="flex flex-col items-center mb-0">
                    <img src={logo} alt="BlissMe Logo" className="w-34 h-12" />
                </div>

                <h3 className="text-black text-xl md:text-2xl mb-2">Welcome to BlissMe App</h3>

                <div className="relative flex flex-col items-center mb-8 mt-6">
                    <img src={heart} alt="Heart" className="w-34 h-16 animate-wiggle animate-infinite" />

                    <Input
                        placeholder="Choose a nickname"
                        value={nickname}
                        onChange={(e) => setNicknameInput(e.target.value)}
                        className="absolute bottom-[-35%] w-[80%] rounded-lg py-2 bg-[#DCF2DE] shadow-md text-center 
                                border border-transparent focus:border-[#BDF2D0] hover:border-[#BDF2D0] focus:ring-0"
                    />
                </div>

                <Button
                    type="default"
                    onClick={handleNext}
                    className="bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:bg-[#1B5E3A] text-white border-none shadow-md"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Nickname;
