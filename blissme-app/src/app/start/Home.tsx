import React, { useEffect, useState } from 'react';
import home from '../../assets/images/home.png';
import home2 from '../../assets/images/home2.png';
import home3 from '../../assets/images/home3.png';
import logo from '../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { getLocalStoragedata } from '../../helpers/Storage';
import about from '../../assets/images/about1.png';
import AOS from "aos";
import "aos/dist/aos.css";

const images = [home, home2, home3];
const sections = ["home", "about", "features"];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("home");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const featuresData = [
        {
            title: "User-Friendly Chatbot",
            description:
                "Chat with BlissMe using **text or voice messages** in a simple and interactive interface.",
            color: "bg-green-100",
            border: "border-green-500",
        },
        {
            title: "Multi-Agent AI System",
            description:
                "Our system has multiple AI agents working together to **analyze emotional state** and provide support.",
            color: "bg-emerald-100",
            border: "border-emerald-500",
        },
        {
            title: "Therapy Suggestions",
            description:
                "Receive **personalized therapy sessions**, mindfulness exercises, and emotional guidance.",
            color: "bg-teal-100",
            border: "border-teal-500",
        },
        {
            title: "Gamified Mental Health Tools",
            description:
                "Engage with interactive **games** and exercises to improve mood and mental resilience.",
            color: "bg-blue-100",
            border: "border-blue-500",
        },
        {
            title: "Journaling & Mood Tracking",
            description:
                "Keep a personal journal and **track your mood** over time to identify patterns and improvements.",
            color: "bg-purple-100",
            border: "border-purple-500",
        },
    ];

    useEffect(() => {
        AOS.init({ duration: 1200, once: true });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center justify-between w-[95%] md:w-[90%] max-w-6xl px-4 md:px-6 py-3 bg-white/50 backdrop-blur-md rounded-xl shadow-lg z-50">
                {/* Logo */}
                <div onClick={handleLogoClick} className="cursor-pointer">
                    <img src={logo} alt="Logo" className="h-8 md:h-10 w-auto" />
                </div>

                {/* Desktop Nav */}
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

                {/* Desktop Buttons */}
                <div className="hidden md:flex space-x-4 items-center">
                    <button
                        onClick={handleLogin}
                        className="border border-green-600 text-green-700 px-3 md:px-4 py-2 rounded-lg hover:bg-green-100 transition text-sm md:text-base"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={handleSignUp}
                        className="border border-green-600 text-green-700 px-3 md:px-4 py-2 rounded-lg hover:bg-green-100 transition text-sm md:text-base"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={handleStartChat}
                        className="bg-emerald-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-emerald-400 transition text-sm md:text-base"
                    >
                        Start Chat
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-md border border-green-600 text-green-700"
                    >
                        ☰
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[95%] md:hidden bg-white shadow-lg rounded-lg p-4 flex flex-col space-y-4 z-50">
                    {sections.map((id) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            className={`font-medium transition ${activeSection === id
                                ? "text-green-700 border-b-2 border-green-600"
                                : "text-gray-700 hover:text-green-600"
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {id.charAt(0).toUpperCase() + id.slice(1)}
                        </a>
                    ))}
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
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-400 transition"
                    >
                        Start Chat
                    </button>
                </div>
            )}

            {/* HOME SECTION with slideshow */}
            <section
                id="home"
                className="relative h-screen flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start px-6 md:px-10 text-white overflow-hidden"
            >
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

                {/* Content */}
                <div className="relative z-10 max-w-lg text-center md:text-left mt-20 md:mt-32 md:ml-4 lg:ml-12">
                    <h1
                        className="text-3xl md:text-5xl font-bold text-green-900 hover:animate-bounce hover:drop-shadow-[0_0_10px_#22c55e]"
                        style={{ fontFamily: 'Merienda, cursive' }}
                    >
                        Your journey to mental wellness starts here
                    </h1>

                    <p
                        className="mt-4 text-green-800 text-base md:text-lg"
                        style={{ fontFamily: 'Merienda, cursive' }}
                    >
                        BlissMe is an AI-based mental health companion that combines therapy,
                        games, and intelligent agents to support your emotional well-being.
                        Connect with a friendly virtual character and begin personalized therapy
                        with just a tap.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-6">
                        <button
                            onClick={handleStartChat}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-400 transition"
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


            {/* ABOUT */}
            <section
                id="about"
                className="h-screen w-full flex items-center justify-center px-6 bg-cover bg-center relative bg-green-100"
            // style={{ backgroundImage: `url(${about})` }}
            >
                {/* Background blobs */}
                <div className="absolute top-[-60px] left-[-60px] w-96 h-96 bg-green-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-[-40px] w-80 h-80 bg-emerald-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-400 rounded-full opacity-25 blur-2xl animate-pulse"></div>
                <div className="absolute bottom-40 left-1/4 w-56 h-56 bg-green-300 rounded-full opacity-25 blur-2xl animate-pulse"></div>
                <div className="absolute top-20 right-1/3 w-44 h-44 bg-emerald-300 rounded-full opacity-20 blur-2xl animate-pulse"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl">

                    <div
                        className="md:w-1/2 text-center md:text-left"
                        data-aos="fade-right"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-green-700"
                            style={{ fontFamily: 'Merienda, cursive' }}
                        >
                            About BlissMe
                        </h1>

                        <p className="mt-4 text-gray-700 text-base md:text-lg max-w-lg">
                            BlissMe is an AI-powered multi-agent depression detection and therapy
                            system designed to support mental wellness through personalized therapy,
                            emotional analysis, and healing-focused experiences.
                        </p>

                    </div>

                    <div className="mt-10 md:mt-0 md:w-1/2 flex flex-col gap-6">

                        {/* Card 1 */}
                        <div
                            className="p-6 rounded-xl shadow-lg bg-emerald-100 border-l-4 border-emerald-500"
                            data-aos="fade-left"
                        >
                            <h3 className="text-lg font-bold text-emerald-700">
                                AI Depression Detection
                            </h3>
                            <p className="text-sm text-gray-700 mt-2">
                                Multi-agent emotional analyzers detect signs of depression through voice
                                tone, text patterns, and behavior recognition.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div
                            className="p-6 rounded-xl shadow-lg bg-green-100 border-l-4 border-green-600"
                            data-aos="fade-left"
                            data-aos-delay="200"
                        >
                            <h3 className="text-lg font-bold text-green-700">
                                Personalized Therapy
                            </h3>
                            <p className="text-sm text-gray-700 mt-2">
                                BlissMe provides calm-guided therapy sessions, journaling support, and
                                mindfulness routines tailored to you.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div
                            className="p-6 rounded-xl shadow-lg bg-teal-100 border-l-4 border-teal-600"
                            data-aos="fade-left"
                            data-aos-delay="400"
                        >
                            <h3 className="text-lg font-bold text-teal-700">
                                Multi-Agent Support System
                            </h3>
                            <p className="text-sm text-gray-700 mt-2">
                                Each agent plays a role emotional detection, therapy guidance,
                                mood tracking, and recovery planning.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section
                id="features"
                className="min-h-screen flex flex-col items-center px-6 py-20 bg-gray-100 relative overflow-hidden"
            >
                {/* Background blobs */}
                <div className="absolute top-[-60px] left-[-60px] w-96 h-96 bg-green-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-[-40px] w-80 h-80 bg-emerald-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-400 rounded-full opacity-25 blur-2xl animate-pulse"></div>
                <div className="absolute bottom-40 left-1/4 w-56 h-56 bg-green-300 rounded-full opacity-25 blur-2xl animate-pulse"></div>
                <div className="absolute top-20 right-1/3 w-44 h-44 bg-emerald-300 rounded-full opacity-20 blur-2xl animate-pulse"></div>

                {/* Background leaves */}
                {/* <div className="absolute top-10 left-1/3 w-32 h-32 rotate-12 bg-green-200 opacity-30 rounded-full clip-[polygon(50%_0%,_61%_35%,_98%_35%,_68%_57%,_79%_91%,_50%_70%,_21%_91%,_32%_57%,_2%_35%,_39%_35%)] animate-pulse"></div>
                <div className="absolute bottom-20 right-1/4 w-28 h-28 rotate-[-15deg] bg-emerald-200 opacity-25 rounded-full clip-[polygon(50%_0%,_61%_35%,_98%_35%,_68%_57%,_79%_91%,_50%_70%,_21%_91%,_32%_57%,_2%_35%,_39%_35%)] animate-pulse"></div>
                <div className="absolute top-1/2 left-10 w-24 h-24 rotate-6 bg-teal-200 opacity-25 rounded-full clip-[polygon(50%_0%,_61%_35%,_98%_35%,_68%_57%,_79%_91%,_50%_70%,_21%_91%,_32%_57%,_2%_35%,_39%_35%)] animate-pulse"></div> */}

                {/* Section title */}
                <h1
                    className="text-3xl md:text-4xl font-bold text-green-700 mb-12 relative z-10"
                    data-aos="fade-down"
                    style={{ fontFamily: 'Merienda, cursive' }}
                >
                    Features
                </h1>

                <div className="relative w-full max-w-4xl z-10">
                    {/* Timeline vertical line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-gray-300"></div>

                    <div className="flex flex-col space-y-12">
                        {featuresData.map((feature, idx) => {
                            const isLeft = idx % 2 === 0;
                            return (
                                <div
                                    key={idx}
                                    className={`flex items-center w-full ${isLeft ? "justify-start" : "justify-end"}`}
                                    data-aos={isLeft ? "fade-right" : "fade-left"}
                                >
                                    {/* Connector Flower Emoji */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 top-6 text-2xl">
                                        🌸
                                    </div>

                                    <div
                                        className={`relative w-5/12 p-6 rounded-xl shadow-lg ${feature.color} border-l-4 ${feature.border}`}
                                    >
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-700 mt-2">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>


            <footer className="bg-emerald-700 text-white py-6">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} BlissMe. All rights reserved.
                    </p>

                    <div className="flex gap-4 mt-2 md:mt-0 justify-center md:justify-end">
                        <a
                            href="#"
                            className="hover:text-green-300 transition-colors duration-300 text-sm"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="hover:text-green-300 transition-colors duration-300 text-sm"
                        >
                            Terms of Service
                        </a>
                        <a
                            href="#"
                            className="hover:text-green-300 transition-colors duration-300 text-sm"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
