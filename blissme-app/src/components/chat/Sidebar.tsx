import React from "react";
import { FaUser } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaCog } from "react-icons/fa";
import { FaLock } from "react-icons/fa6"; // Fa6Lock is in `react-icons/fa6`, not `fa`
import { HiLockClosed } from "react-icons/hi";
import user from "../../assets/images/user.png";
import { Send, User, Bot, Heart, Brain, MessageCircle, Settings, Home, Calendar, Mic } from 'lucide-react';



const Sidebar = () => {
    return (
        <div className="w-16 bg-green-300 bg-opacity-50 flex flex-col items-center py-4 space-y-6 shadow-md">
            <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
                <img src={user} alt="Avatar" className="object-cover w-full h-full" />
            </div>

            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
                <Brain className="w-6 h-6 text-emerald-600" />
            </button>
            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
                <Home className="w-6 h-6     text-white" />
            </button>
            <button className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-500 transition-all duration-200 hover:scale-110">
                <MessageCircle className="w-6 h-6 text-white" />
            </button>
            <button className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-500 transition-all duration-200 hover:scale-110">
                <Calendar className="w-6 h-6 text-white" />
            </button>
            <button className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-500 transition-all duration-200 hover:scale-110">
                <Heart className="w-6 h-6 text-white" />
            </button>
            <button className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-500 transition-all duration-200 hover:scale-110">
                <Mic className="w-6 h-6 text-white" />
            </button>
            <button className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-500 transition-all duration-200 hover:scale-110">
                <Settings className="w-6 h-6 text-white" />
            </button>
            {/* <FaUser /> */}
            {/* <FaComments size={40} color="green" /> */}
            {/* <FaMicrophone /> */}
            {/* <FaCog /> */}
            {/* <HiLockClosed /> */}
        </div>
    );
};

export default Sidebar;
