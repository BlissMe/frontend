import user from "../../assets/images/user.png";
import { useContext, useState, useRef, useEffect } from "react";
import {
  Heart,
  Brain,
  MessageCircle,
  Settings,
  Home,
  Calendar,
  Mic,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../app/context/AuthContext";
import { endCurrentSession } from "../../services/ChatMessageService";
import { useNotification } from "../../app/context/notificationContext";
import { getLocalStoragedata } from "../../helpers/Storage";

const Sidebar: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showBrainDropdown, setShowBrainDropdown] = useState(false);
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

  const brainRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    if (sessionID) {
      const res = await endCurrentSession(sessionID);
      if (!res.success) {
        openNotification("warning", "Logout failed. Please try again.");
        return;
      } else {
        openNotification("success", "Logout successfully");
      }
    }
    setToken(null);
    setSessionID("");
    setMessages([]);
    setChatHistory([]);
    setIsSessionEnded(true);
    localStorage.clear();
    navigate("/login");
  };

  const storedUser = JSON.parse(getLocalStoragedata("reduxState") || "{}");
  const selectedMode = storedUser?.user?.inputMode;
  const chatRoute = selectedMode === "Voice" ? "/chat-new/voice" : "/chat-new/text";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brainRef.current && !brainRef.current.contains(event.target as Node)) {
        setShowBrainDropdown(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-16 bg-green-300 bg-opacity-50 flex flex-col items-center py-4 space-y-6 shadow-md">
      <div className="flex flex-col items-center space-y-6 flex-grow">
        <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
          <img src={user} alt="Avatar" className="object-cover w-full h-full" />
        </div>

        <Link to={chatRoute}>
          <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
            <MessageCircle className="w-6 h-6 text-emerald-600" />
          </button>
        </Link>

        <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
          <Home className="w-6 h-6 text-white" />
        </button>

        {/* <div className="relative" ref={brainRef}>
          <button
            className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-500 transition-all duration-200 hover:scale-110"
            onClick={() => setShowBrainDropdown((prev) => !prev)}
          >
            <Brain className="w-6 h-6 text-white" />
          </button>

          {showBrainDropdown && (
            <div className="absolute left-14 bottom-0 bg-white border rounded-md shadow-lg py-2 z-50 w-48 text-sm">
              <Link
                to="/therapy/breathing"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowBrainDropdown(false)}
              >
                Breathing Therapy
              </Link>
              <Link
                to="/therapy/medication"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowBrainDropdown(false)}
              >
                Meditation
              </Link>
              <Link
                to="/dash/anxiety"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowBrainDropdown(false)}
              >
                Anxiety Games
              </Link>
              <Link
                to="/therapy/mood-tracker-home"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowBrainDropdown(false)}
              >
                Mood Tracker
              </Link>
              <Link
                to="/game/therapy_game"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowBrainDropdown(false)}
              >
                Number Guessingm Game
              </Link>
            </div>
          )}
        </div> */}

        <button className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-500 transition-all duration-200 hover:scale-110">
          <Calendar className="w-6 h-6 text-white" />
        </button>

        <button className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-500 transition-all duration-200 hover:scale-110">
          <Heart className="w-6 h-6 text-white" />
        </button>

        <button className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-500 transition-all duration-200 hover:scale-110">
          <Mic className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="relative space-y-6" ref={settingsRef}>
        <button
          className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-500 transition-all duration-200 hover:scale-110"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          <Settings className="w-6 h-6 text-white" />
        </button>

        {showSettings && (
          <div className="absolute left-14 bottom-0 bg-white border rounded-md shadow-lg py-2 z-50 w-48 text-sm">
            <Link
              to="/chat/setting/profile"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setShowSettings(false)}
            >
              Profile Settings
            </Link>
            <Link
              to="/chat/setting/account"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setShowSettings(false)}
            >
              Account Settings
            </Link>
            <Link
              to="/chat/setting/security"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setShowSettings(false)}
            >
              Security Settings
            </Link>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-10 h-10 bg-emerald-600/70 rounded-xl flex items-center justify-center shadow-md hover:bg-red-400 transition-all duration-200 hover:scale-110"
        >
          <LogOut className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
