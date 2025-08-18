import React, { useEffect, useState } from 'react';
import home from '../../assets/images/home.png';
import home2 from '../../assets/images/home2.png';
import home3 from '../../assets/images/home3.png';
import logo from '../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { getLocalStoragedata } from '../../helpers/Storage';

const images = [home, home2, home3];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSignUp = () => navigate('/register');
    const handleLogin = () => navigate('/sign-in');
    const handleLogoClick = () => navigate('/home');

    const storedUser = JSON.parse(getLocalStoragedata("reduxState") || "{}");
    const selectedMode = storedUser?.user?.inputMode;
    console.log(selectedMode);

    const handleStartChat = () => {
        if (selectedMode === 'Text') {
            navigate('/chat-new/text');
        } else if (selectedMode === 'Voice') {
            navigate('/chat-new/voice');
        } else {
            navigate('/sign-in');
        }
    };


    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Hero Section */}
            <div className="flex items-center justify-between px-10 mt-2 text-white">
                {/* Left Text */}
                <div className="max-w-lg z-10 text-left ml-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-green-900 mt-[120px] hover:animate-bounce hover:drop-shadow-[0_0_10px_#22c55e]" style={{ fontFamily: 'Merienda, cursive' }}>
                        Your journey to mental wellness starts here
                    </h1>

                    <p className="mt-4 text-green-800 text-lg" style={{ fontFamily: 'Merienda, cursive' }}>
                        BlissMe is an AI-based mental health companion that combines therapy, games, and intelligent agents to support your emotional well-being. Connect with a friendly virtual character and begin personalized therapy with just a tap.
                    </p>

                    <div className='flex flex-row justify-start gap-4 mt-6'>
                        <button
                            onClick={handleStartChat}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Start Chat
                        </button>

                        <button onClick={handleLogin}
                            className="border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition bg-white">
                            Sign In
                        </button>
                    </div>
                    {/* Bottom Features Section */}
                    <div className='relative z-10 flex flex-col items-center ml-72'>
                        <div className='flex flex-col md:flex-row justify-center gap-6 mt-10'>
                            <div className='bg-[#6BBF8A] p-4 rounded-xl shadow-lg max-w-sm w-64 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl'>
                                <h1 className='text-md font-bold text-black mb-2'>🧠 Assessment Tools</h1>
                                <p className='text-black text-sm font-Roboto'>
                                    Conducts mental health evaluations using questionnaires and AI-driven sentiment analysis to understand your emotional state.
                                </p>
                            </div>

                            <div className='bg-[#F2C1B6] p-4 rounded-xl shadow-lg max-w-sm w-64 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl'>
                                <h1 className='text-md font-bold text-black mb-2'>🎮 Games & Mindfulness</h1>
                                <p className='text-black text-sm font-Roboto'>
                                    Explore therapeutic mini-games and guided mindfulness sessions to improve mood, reduce stress, and build healthy habits.
                                </p>
                            </div>

                            <div className='bg-[#BDF2D0] p-4 rounded-xl shadow-lg max-w-sm w-64 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl'>
                                <h1 className='text-md font-bold text-black mb-2'>📊 Mood Monitoring & Crisis</h1>
                                <p className='text-black text-sm font-Roboto'>
                                    Tracks your mood patterns over time. In case of severe distress, the system connects you to support organizations instantly.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Slideshow */}
                <div
                    className="absolute top-0 left-0 h-full w-full flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Slide ${index}`}
                            className="w-full h-full object-cover flex-shrink-0"
                        />
                    ))}
                </div>

                {/* Navbar */}
                <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-2 bg-white bg-opacity-70 backdrop-blur-md z-10">
                    <div onClick={handleLogoClick} className="cursor-pointer">
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                    </div>

                    <div className="hidden md:flex space-x-6">
                        <a href="#about" className="text-gray-700 hover:text-green-700 font-medium">
                            {/*About  */}
                        </a>
                    </div>

                    <div className="flex space-x-4 items-center">
                        <button
                            onClick={handleLogin}
                            className="border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={handleSignUp}
                            className="border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={handleStartChat}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Start Chat
                        </button>

                    </div>
                </nav>
            </div>


        </div>
    );
};

export default Home;
