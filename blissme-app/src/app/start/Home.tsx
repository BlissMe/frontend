import React, { useEffect, useState } from 'react';
import home from '../../assets/images/home.png';
import home2 from '../../assets/images/home2.png';
import home3 from '../../assets/images/home3.png';
import logo from '../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { getLocalStoragedata } from '../../helpers/Storage';

const images = [home, home2, home3];
const sections = ["home", "about", "features", "contact"];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("home");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

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
                        className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm md:text-base"
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
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
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


            {/* ABOUT */}
            <section
                id="about"
                className="h-screen flex flex-col items-center justify-center px-6 text-center bg-gray-100"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-green-700">About BlissMe</h1>
                <p className="mt-4 max-w-2xl text-gray-700 text-base md:text-lg">
                    BlissMe provides AI-driven mental wellness support with therapy,
                    personalized games, and interactive conversations.
                </p>
            </section>

            {/* FEATURES */}
            <section
                id="features"
                className="h-screen flex flex-col items-center justify-center px-6 text-center bg-blue-100"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Features</h1>
                <ul className="mt-6 space-y-3 text-gray-700 text-base md:text-lg">
                    <li>✔ Personalized Therapy Sessions</li>
                    <li>✔ Voice & Text Chat Support</li>
                    <li>✔ Gamified Mental Health Tools</li>
                </ul>
            </section>

            {/* CONTACT */}
            <section
                id="contact"
                className="h-screen flex flex-col items-center justify-center px-6 text-center bg-green-100"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-green-700">Contact Us</h1>
                <p className="mt-4 text-gray-700 text-base md:text-lg">
                    Have questions? Reach out to us anytime.
                </p>
                <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                    Get in Touch
                </button>
            </section>
        </div>
    );
};

export default Home;
