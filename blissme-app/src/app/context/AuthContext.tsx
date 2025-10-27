import React, { createContext, useState, ReactNode, useEffect } from "react";
import { ConfigProvider } from "antd";
import {
  getLocalStoragedata,
  setLocalStorageData,
} from "../../helpers/Storage";
import { getCurrentTime } from "../../helpers/Time";
import { jwtDecode } from "jwt-decode"; 

export interface Message {
  sender: string;
  text: string;
  time: string;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  sessionID: string;
  setSessionID: (id: string) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  isSessionEnded: boolean;
  setIsSessionEnded: (ended: boolean) => void;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  sessionID: "",
  setSessionID: () => {},
  messages: [],
  setMessages: () => {},
  chatHistory: [],
  setChatHistory: () => {},
  isSessionEnded: false,
  setIsSessionEnded: () => {},
  handleLogout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromURL = urlParams.get("token");
  const storedToken = getLocalStoragedata("token");
  const initialToken = tokenFromURL || storedToken;

  const [token, setToken] = useState<string | null>(initialToken);
  const [sessionID, setSessionID] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "popo",
      text: "Hi there. How are you feeling today?",
      time: getCurrentTime(),
    },
  ]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isSessionEnded, setIsSessionEnded] = useState(false);

  const handleLogout = () => {
    setToken(null);
    setSessionID("");
    setMessages([]);
    setChatHistory([]);
    setIsSessionEnded(true);
    localStorage.clear();
    window.location.href = "/home"; 
  };

  useEffect(() => {
    if (tokenFromURL) {
      setLocalStorageData("token", tokenFromURL);
      const cleanURL = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanURL);
    }
  }, [tokenFromURL]);

  useEffect(() => {
    if (!token) return;

    try {
      const decoded: { exp: number } = jwtDecode(token); 
      const expiryTime = decoded.exp * 1000 - Date.now();

      if (expiryTime <= 0) {
        handleLogout(); 
      } else {
        const timer = setTimeout(() => {
          handleLogout();
        }, expiryTime);

        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.error("Failed to decode token", err);
      handleLogout();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        sessionID,
        setSessionID,
        messages,
        setMessages,
        chatHistory,
        setChatHistory,
        isSessionEnded,
        setIsSessionEnded,
        handleLogout,
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Notification: {
              paddingMD: 15,
              colorIcon: "rgb(255, 255, 255)",
              colorTextHeading: "rgba(254, 254, 254, 0.88)",
              colorIconHover: "rgb(255, 255, 255)",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AuthContext.Provider>
  );
}
