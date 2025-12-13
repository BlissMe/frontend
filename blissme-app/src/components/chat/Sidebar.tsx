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
  UserMinus
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

  const Tooltip = ({ label, className = "" }: { label: string; className?: string }) => (
    <div className={`absolute left-14 top-1/2 -translate-y-1/2 bg-emerald-800 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap z-[9999] ${className}`}>
      {/* Arrow */}
      <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 
      border-t-4 border-b-4 border-r-4 border-transparent border-r-emerald-800" />
      {label}
    </div>
  );


  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-16 bg-green-300 bg-opacity-50 flex-col items-center py-4 space-y-6 shadow-md">
        <div className="flex flex-col items-center space-y-6 flex-grow">

          {/* Avatar */}
          <div className="group relative flex justify-center">
            <Link to="/chat/setting/profile" className="w-10 h-10 rounded-full bg-white overflow-hidden">
              <img src={user} alt="Avatar" className="object-cover w-full h-full" />
            </Link>
          </div>

          {/* Chat */}
          <div className="group relative flex justify-center">
            <Link to={chatRoute}>
              <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
                <MessageCircle className="w-6 h-6 text-white" />
              </button>
            </Link>
            <Tooltip label="Chat" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          {/* Home */}
          <div className="group relative flex justify-center">
            <Link to="/home">
              <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all duration-200 hover:scale-110">
                <Home className="w-6 h-6 text-white" />
              </button>
            </Link>
            <Tooltip label="Home" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          {/* Therapy (Brain) - GAMES REMOVED */}
          <div className="group relative flex justify-center">
            <Link to="/home#therapy">
              <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all hover:scale-110">
                <Brain className="w-6 h-6 text-white" />
              </button>
            </Link>
            <Tooltip label="Therapy" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          {/* Calendar */}
          {/* <div className="group relative flex justify-center">
            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all hover:scale-110">
              <Calendar className="w-6 h-6 text-white" />
            </button>
            <Tooltip label="Calendar" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div> */}

          {/* Doctors */}
          <div className="group relative flex justify-center">
            <Link to="/therapy/all-doctors">
              <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all hover:scale-110">
                <Heart className="w-6 h-6 text-white" />
              </button>
            </Link>
            <Tooltip label="Doctors" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          {/* Songs */}
          {/* <div className="group relative flex justify-center">
            <Link to="/therapy/all-songs">
              <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all hover:scale-110">
                <Mic className="w-6 h-6 text-white" />
              </button>
            </Link>
            <Tooltip label="Voice" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div> */}

        </div>

        {/* Settings */}
        <div className="relative space-y-6" ref={settingsRef}>
          <div className="group relative flex justify-center">
            <Link to="/unsubscribe">
              <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all hover:scale-110">
                <UserMinus className="w-6 h-6 text-white" />
              </button>
            </Link>
            <Tooltip
              label="Unsubscribe"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>

          <div className="relative">
            <button
              className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all hover:scale-110"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-6 h-6 text-white" />
            </button>

            {showSettings && (
              <div className="absolute left-12 bottom-[-40px] bg-white shadow-lg rounded-xl py-2 w-40 z-50">
                <Link
                  to="/chat/setting/profile"
                  className="block px-4 py-1 hover:bg-emerald-100"
                >
                  Profile
                </Link>
                <Link
                  to="/chat/setting/account"
                  className="block px-4 py-1 hover:bg-emerald-100"
                >
                  Account
                </Link>
                <Link
                  to="/chat/setting/security"
                  className="block px-4 py-1 hover:bg-emerald-100"
                >
                  Security
                </Link>
              </div>
            )}
          </div>


          {/* Logout */}
          <div className="group relative flex justify-center">
            <button
              onClick={handleLogout}
              className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-red-400 transition-all hover:scale-110"
            >
              <LogOut className="w-6 h-6 text-white" />
            </button>
            <Tooltip label="Logout" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
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
          <div className="absolute top-14 right-4 bg-white border rounded-md shadow-lg py-3 px-4 z-[9999] w-42 flex flex-col space-y-3 text-sm">
            <Link
              to="/chat/setting/profile"
              className="flex items-center gap-3 pb-2 border-b border-gray-200 mb-2 hover:bg-gray-100 p-2 rounded-lg transition"
              onClick={() => setMenuOpen(false)}  // optional if inside menu
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                <img
                  src={user}
                  alt="User"
                  className="object-cover w-full h-full"
                />
              </div>

              <span className="text-gray-700 font-medium">My Profile</span>
            </Link>


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
              to="/home#therapy"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <Brain className="w-5 h-5 text-emerald-600" /> Therapy
            </Link>

            {/* <Link
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

            <hr /> */}
            <div className="group relative flex justify-center">
              <Link to="/unsubscribe">
                <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shadow-md hover:bg-emerald-300 transition-all hover:scale-110">
                  <UserMinus className="w-6 h-6 text-white" />
                </button>
              </Link>
              <Tooltip
                label="Unsubscribe"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2"
              >
                <Settings className="w-5 h-5 text-emerald-600" /> Settings
              </button>

              {showSettings && (
                <div className="absolute left-0 top-8 bg-white shadow-lg rounded-xl py-2 w-40 z-50">
                  <Link
                    to="/chat/setting/profile"
                    className="block px-4 py-1 hover:bg-emerald-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    to="/chat/setting/account"
                    className="block px-4 py-1 hover:bg-emerald-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Account
                  </Link>

                  <Link
                    to="/chat/setting/security"
                    className="block px-4 py-1 hover:bg-emerald-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Security
                  </Link>
                </div>
              )}
            </div>


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
