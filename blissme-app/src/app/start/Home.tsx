import React, { useEffect, useState } from 'react';
import home from '../../assets/images/home.png';
import home2 from '../../assets/images/home2.png';
import home3 from '../../assets/images/home3.png';
import logo from '../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { getLocalStoragedata } from '../../helpers/Storage';

const images = [home, home2, home3];
const sections = ["about", "features", "contact"];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("about");
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Observe sections for active navbar highlight
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.6 }
        );

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleSignUp = () => navigate('/register');
    const handleLogin = () => navigate('/sign-in');
    const handleLogoClick = () => navigate('/home');

    const storedUser = JSON.parse(getLocalStoragedata("reduxState") || "{}");
    const selectedMode = storedUser?.user?.inputMode;

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
        <div className="relative min-h-screen scroll-smooth">
            {/* Navbar */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center justify-between w-[90%] max-w-6xl px-6 py-3 bg-white/50 backdrop-blur-md rounded-xl shadow-lg z-50">
                {/* Logo */}
                <div onClick={handleLogoClick} className="cursor-pointer">
                    <img src={logo} alt="Logo" className="h-10 w-auto" />
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex space-x-6">
                    {sections.map((id) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            className={`font-medium transition ${activeSection === id
                                ? "text-green-700 border-b-2 border-green-600"
                                : "text-gray-700 hover:text-green-600"
                                }`}
                        >
                            {id.charAt(0).toUpperCase() + id.slice(1)}
                        </a>
                    ))}
                </div>

                {/* Buttons */}
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

            {/* HOME SECTION with background slideshow */}
            <section id="home" className="relative h-screen flex items-center justify-between px-10 text-white overflow-hidden">
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

                {/* Content on top of slideshow */}
                <div className="relative z-10 max-w-lg ml-10 text-left">
                    <h1
                        className="text-4xl md:text-5xl font-bold text-green-900 mt-[120px] hover:animate-bounce hover:drop-shadow-[0_0_10px_#22c55e]"
                        style={{ fontFamily: 'Merienda, cursive' }}
                    >
                        Your journey to mental wellness starts here
                    </h1>

                    <p
                        className="mt-4 text-green-800 text-lg"
                        style={{ fontFamily: 'Merienda, cursive' }}
                    >
                        BlissMe is an AI-based mental health companion that combines therapy, games, and intelligent agents to support your emotional well-being. Connect with a friendly virtual character and begin personalized therapy with just a tap.
                    </p>

                    <div className="flex flex-row justify-start gap-4 mt-6">
                        <button
                            onClick={handleStartChat}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Start Chat
                        </button>

                        <button
                            onClick={handleLogin}
                            className="border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition bg-white"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            {/* OTHER SECTIONS (no slideshow background) */}
            <section id="home" className="">
                <h1 className="text-4xl font-bold text-green-700">About BlissMe</h1>
            </section>
            <section id="about" className="h-screen flex items-center justify-center bg-gray-100">
                <h1 className="text-4xl font-bold text-green-700">About BlissMe</h1>
            </section>

            <section id="features" className="h-screen flex items-center justify-center bg-blue-100">
                <h1 className="text-4xl font-bold text-blue-700">Features</h1>
            </section>

            <section id="contact" className="h-screen flex items-center justify-center bg-green-100">
                <h1 className="text-4xl font-bold text-green-700">Contact Us</h1>
            </section>
        </div>
    );
};

export default Home;
