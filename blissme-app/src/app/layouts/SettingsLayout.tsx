import React from "react";
import ChatInterface from "../../components/chat/ChatInterface";
import Sidebar from "../../components/chat/Sidebar";
import bg from "../../assets/images/chat-bg.png"
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { Content } from "antd/es/layout/layout";

const SettingsLayout = () => {
    const navigate = useNavigate();
    const handleLogoClick = () => navigate('/home');

    return (
        <div
            className="w-screen h-screen flex flex-col md:flex-row overflow-hidden relative "
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

            <Content className="w-full h-full p-2 overflow-scroll">
                <Outlet />
            </Content>

            {/* SettingsLayout Interface fills remaining space */}
        </div>
    );
};

export default SettingsLayout;
