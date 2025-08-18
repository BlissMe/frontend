import React from "react";
import ChatInterface from "../../components/chat/ChatInterface";
import Sidebar from "../../components/chat/Sidebar";
import bg from "../../assets/images/chatbg.png"
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const VoiceChat = () => {
    const navigate = useNavigate();
    const handleLogoClick = () => navigate('/home');

    return (
        <div
            className="w-screen h-screen flex overflow-hidden relative"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Sidebar */}
            <Sidebar />

            {/* Logo positioned at top, right side of sidebar */}
            <div
                onClick={handleLogoClick}
                className="absolute top-4 left-20 cursor-pointer z-20"
                style={{ width: 'auto', height: '40px' }}
            >
                <img src={logo} alt="Logo" className="h-10 w-auto" />
            </div>

            {/* Chat Interface fills remaining space */}
            <ChatInterface />
        </div>
    );
};

export default VoiceChat;
