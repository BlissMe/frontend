import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import logo from "../../assets/images/logo.png";
import heart from "../../assets/images/heart.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPreferencesSuccess } from '../../redux/reducers/userReducer';
import { RootState } from '../../redux/store';
import { LayeredBackground } from 'animated-backgrounds';

const url = process.env.REACT_APP_API_URL;
console.log("API URL:", url);

interface Character {
    _id: string;
    name: string;
    imageUrl: string;
    characterId: number;
    __v: number;
}

const VirtualCharacter = () => {
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

    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Get nickname from Redux
    const nickname = useSelector((state: RootState) => state.user.nickname);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await axios.get<Character[]>(`${url}/`);
                console.log("Characters fetched:", response.data);
                setCharacters(response.data);
            } catch (error: any) {
                console.error("Error fetching characters:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    const handleNext = () => {
        if (!selectedCharacterId) {
            alert("Please select a virtual character!");
            return;
        }

        dispatch(setPreferencesSuccess({
            nickname,
            virtualCharacter: selectedCharacterId,
            inputMode: ""
        }));

        console.log("Virtual character selected:", selectedCharacterId);
        navigate('/input-mode');
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            <div className="absolute inset-0 z-10">
                <LayeredBackground layers={layers} />
            </div>
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

                    <div className="bottom-0 w-[90%] bg-[#DCF2DE] shadow-md rounded-lg px-4 py-3 translate-y-[-10%]">
                        <label className="text-gray-600 text-sm text-center block max-w-full mb-2">
                            Pick a virtual character to chat with, just the way you like!
                        </label>

                        <div className="w-full overflow-x-auto p-2">
                            <div className="flex gap-4 w-max px-2">
                                {characters.map((character) => (
                                    <div
                                        key={character._id}
                                        onClick={() => setSelectedCharacterId(character.characterId)}
                                        className={`flex flex-col items-center min-w-[80px] bg-white bg-opacity-50 rounded-lg p-1 shadow-md transition-transform cursor-pointer hover:scale-105
                                            ${selectedCharacterId === character.characterId
                                                ? 'border-2 border-[#1B5E3A]'
                                                : 'border border-transparent'}
                                        `}
                                    >
                                        <img
                                            src={character.imageUrl}
                                            alt={`Character ${character.name}`}
                                            className="w-12 h-12 object-contain"
                                        />
                                        <span className="mt-1 text-xs font-medium">{character.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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

export default VirtualCharacter;
