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
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../app/context/AuthContext";
import { endCurrentSession } from "../../services/ChatMessageService";
import { useNotification } from "../../app/context/notificationContext";
import { getLocalStoragedata } from "../../helpers/Storage";

const Sidebar: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showBrainDropdown, setShowBrainDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
  const chatRoute =
    selectedMode === "Voice" ? "/chat-new/voice" : "/chat-new/text";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        brainRef.current &&
        !brainRef.current.contains(event.target as Node)
      ) {
        setShowBrainDropdown(false);
      }
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-16 bg-green-300 bg-opacity-50 flex-col items-center py-4 space-y-6 shadow-md">
        <div className="flex flex-col items-center space-y-6 flex-grow">
          <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
            <img
              src={user}
              alt="Avatar"
              className="object-cover w-full h-full"
            />
          </div>

          <Link to={chatRoute}>
            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
          </Link>

          <Link to="/home">
            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
              <Home className="w-6 h-6 text-white" />
            </button>
          </Link>

          <div className="relative z-50" ref={brainRef}>
            <button
              className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110"
              onClick={() => setShowBrainDropdown((prev) => !prev)}
            >
              <Brain className="w-6 h-6 text-white" />
            </button>

            {showBrainDropdown && (
              <div className="absolute left-14 top-0 mt-10 bg-white border rounded-md shadow-lg py-2 z-[9999] w-52 text-sm max-h-80 overflow-y-auto">
                <Link
                  to="/therapy/breathing"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Breathing Therapy
                </Link>
                <Link
                  to="/therapy/medication"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Meditation
                </Link>
                <Link
                  to="/dash/anxiety"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Anxiety Games
                </Link>
                <Link
                  to="/dash/zen"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  BloomMind
                </Link>
                <Link
                  to="/dash/forest"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Mindful Forest
                </Link>
                <Link
                  to="/dash/ocean"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  WaveMind
                </Link>
                <Link
                  to="/therapy/mood-tracker-home"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Mood Tracker
                </Link>
                <Link
                  to="/game/therapy_game"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Number Guessing Game
                </Link>
                <Link
                  to="/therapy/body-scan"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Body Scan Therapy
                </Link>
              </div>
            )}
          </div>

          <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
            <Calendar className="w-6 h-6 text-white" />
          </button>

          <Link to="/therapy/all-doctors">
            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
              <Heart className="w-6 h-6 text-white" />
            </button>
          </Link>

          <Link to="/therapy/all-songs">
            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
              <Mic className="w-6 h-6 text-white" />
            </button>
          </Link>
        </div>

        {/* Settings & Logout */}
        <div className="relative space-y-6 z-50" ref={settingsRef}>
          <button
            className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110"
            onClick={() => setShowSettings((prev) => !prev)}
          >
            <Settings className="w-6 h-6 text-white" />
          </button>

          {showSettings && (
            <div className="absolute left-14 bottom-0 bg-white border rounded-md shadow-lg py-2 z-[9999] w-48 text-sm">
              <Link
                to="/chat/setting/profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Profile Settings
              </Link>
              <Link
                to="/chat/setting/account"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Account Settings
              </Link>
              <Link
                to="/chat/setting/security"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Security Settings
              </Link>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-red-400 transition-all duration-200 hover:scale-110"
          >
            <LogOut className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Topbar */}
      <div className="flex md:hidden items-center justify-end px-4 py-3 bg-green-200 shadow-md">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-emerald-700 p-2"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="absolute top-14 right-4 bg-white border rounded-md shadow-lg py-3 px-4 z-[9999] w-56 flex flex-col space-y-3 text-sm">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200 mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                <img
                  src={user}
                  alt="User"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-gray-700 font-medium">My Profile</span>
            </div>

            <Link
              to={chatRoute}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" /> Chat
            </Link>

            <Link
              to="/home"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <Home className="w-5 h-5 text-emerald-600" /> Home
            </Link>

            <Link
              to="/therapy/breathing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <Brain className="w-5 h-5 text-emerald-600" /> Brain Therapy
            </Link>

            <Link
              to="/therapy/mood-tracker-home"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <Heart className="w-5 h-5 text-emerald-600" /> Mood Tracker
            </Link>

            <Link
              to="/calendar"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-emerald-600" /> Calendar
            </Link>

            <Link
              to="/therapy/all-songs"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <Mic className="w-5 h-5 text-emerald-600" /> Voice
            </Link>

            <hr />

            <Link
              to="/chat/setting/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <Settings className="w-5 h-5 text-emerald-600" /> Settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
