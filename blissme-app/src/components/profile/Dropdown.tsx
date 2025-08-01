import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, message, Space } from "antd";
import Avatar from "./Avatar";
import { useCharacterContext } from "../../app/context/CharacterContext";
import { AuthContext } from "../../app/context/AuthContext";
import { endCurrentSession } from "../../services/ChatMessageService";
import { useNotification } from "../../app/context/notificationContext";

const ProfileDropdown: React.FC = () => {
  const { nickname } = useCharacterContext();
  const navigate = useNavigate();

  const {
    setToken,
    sessionID,
    setSessionID,
    setMessages,
    setChatHistory,
    setIsSessionEnded,
  } = useContext(AuthContext);
  const { openNotification } = useNotification();

  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "3") {
      if (sessionID) {
        const res = await endCurrentSession(sessionID);
        if (!res.success) {
          openNotification("warning", "Logout failed. Please try again.");
          return;
        } else {
          openNotification("success", "Logout successfully");
        }
      }

      setIsSessionEnded(true);
      setMessages([]);
      setChatHistory([]);
      setSessionID("");
      setToken(null);
      localStorage.clear()

      navigate("/sign-in");
    } else {
      message.info(`Clicked on item ${key}`);
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      label: "My Profile",
      key: "1",
    },
    {
      label: "Notification",
      key: "2",
    },
    {
      label: "Logout",
      key: "3",
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar username={nickname ?? "User"} />
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default ProfileDropdown;
