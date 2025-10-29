import React from "react";
import ChatInterface from "../../components/chat/ChatInterface";
import Sidebar from "../../components/chat/Sidebar";
import bg from "../../assets/images/chatbg.png"
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { getLocalStoragedata } from "../../helpers/Storage";
import VoiceChatInterface from "../../components/chat/VoiceChatInterface";

const VoiceChat = () => {
    const navigate = useNavigate();
    const handleLogoClick = () => navigate('/home');
    const storedUser = JSON.parse(getLocalStoragedata("reduxState") || "{}");
    const selectedMode = storedUser?.user?.inputMode;

    return (
        <div
            className="w-screen h-screen flex flex-col md:flex-row overflow-hidden relative"
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
                className="absolute top-4 left-8 md:left-20 cursor-pointer z-20"
                style={{ width: "auto", height: "40px" }}
            >
                <img src={logo} alt="Logo" className="h-10 w-auto" />
            </div>
            {/* Chat Interface fills remaining space */}
            <div className="flex-1 flex justify-center items-center h-full overflow-hidden">

                <VoiceChatInterface />
            </div>
        </div>
    );
};

export default VoiceChat;