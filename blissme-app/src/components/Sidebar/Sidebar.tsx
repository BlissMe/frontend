import React, { useState } from "react";
import {
  MessageOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <div className="text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/chat/text" className="flex items-center gap-2 hover:text-blue-400">
            <MessageOutlined />
            Chat
          </Link>
        </li>
        <li>
          <button
            onClick={toggleSettings}
            className="flex items-center gap-2 hover:text-blue-400 focus:outline-none w-full text-left"
          >
            <SettingOutlined />
            Settings
            {settingsOpen ? <UpOutlined className="ml-auto" /> : <DownOutlined className="ml-auto" />}
          </button>
          {settingsOpen && (
            <ul className="ml-6 mt-2 space-y-2 text-sm">
              <li>
                <Link to="/chat/setting/profile" className="hover:text-blue-300">
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link to="/chat/setting/account" className="hover:text-blue-300">
                  Account Settings
                </Link>
              </li>
             {/*  <li>
                <Link to="/chat/setting/security" className="hover:text-blue-300">
                  Security Settings
                </Link>
              </li> */}
            </ul>
          )}
        </li>
        <li>
          <Link to="/chat/faq" className="flex items-center gap-2 hover:text-blue-400">
            <QuestionCircleOutlined />
            FAQ
          </Link>
        </li>
        <li>
          <Link to="/chat/games" className="flex items-center gap-2 hover:text-blue-400">
            <PlayCircleOutlined />
            Games
          </Link>
        </li>
        <li>
          <Link to="/chat/privacy-policy" className="flex items-center gap-2 hover:text-blue-400">
            <FileTextOutlined />
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link to="/chat/terms" className="flex items-center gap-2 hover:text-blue-400">
            <FileTextOutlined />
            Terms & Conditions
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
