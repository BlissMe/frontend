import React from "react";
import { MessageOutlined, SettingOutlined, QuestionCircleOutlined, PlayCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className=" text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/chat/text" className="flex items-center gap-2 hover:text-blue-400">
            <MessageOutlined />
            Chat
          </Link>
        </li>
        <li>
          <Link to="/chat/text" className="flex items-center gap-2 hover:text-blue-400">
            <SettingOutlined />
            Settings
          </Link>
        </li>
        <li>
          <Link to="/chat/text" className="flex items-center gap-2 hover:text-blue-400">
            <QuestionCircleOutlined />
            FAQ
          </Link>
        </li>
        <li>
          <Link to="/chat/text" className="flex items-center gap-2 hover:text-blue-400">
            <PlayCircleOutlined />
            Games
          </Link>
        </li>
        <li>
          <Link to="/chat/text" className="flex items-center gap-2 hover:text-blue-400">
            <FileTextOutlined />
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link to="/chat/text" className="flex items-center gap-2 hover:text-blue-400">
            <FileTextOutlined />
            Terms & Conditions
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
