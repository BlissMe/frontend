import user from "../../assets/images/user.png";
import { useContext, useState, useRef, useEffect } from "react";
import {
  Heart,
  Brain,
  MessageCircle,
  Settings,
  Home,
  LogOut,
  Menu,
  X,
  UserMinus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../app/context/AuthContext";
import { endCurrentSession } from "../../services/ChatMessageService";
import { useNotification } from "../../app/context/notificationContext";
import { getLocalStoragedata } from "../../helpers/Storage";
import { unsubscribeUser } from "../../services/SubscriptionService";

const Sidebar: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔹 NEW STATES
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [unsubscribeLoading, setUnsubscribeLoading] = useState(false);

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
  const settingsRef = useRef<HTMLDivElement>(null);

  const storedUser = JSON.parse(getLocalStoragedata("reduxState") || "{}");
  const selectedMode = storedUser?.user?.inputMode;
  const chatRoute =
    selectedMode === "Voice" ? "/chat-new/voice" : "/chat-new/text";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (sessionID) {
      const res = await endCurrentSession(sessionID);
      if (!res.success) {
        openNotification("warning", "Logout failed. Please try again.");
        return;
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

  const subscriberId = getLocalStoragedata("subscriberId") || "";

const handleUnsubscribe = async () => {
  setUnsubscribeLoading(true);

  const res = await unsubscribeUser(subscriberId);

  if (!res.success) {
    openNotification("error", "Unsubscribe failed. Please try again.");
    setUnsubscribeLoading(false);
    return;
  }

  openNotification("success", "You have successfully unsubscribed.");

  // Clear everything
  setToken(null);
  setSessionID("");
  setMessages([]);
  setChatHistory([]);
  setIsSessionEnded(true);
  localStorage.clear();

  navigate("/login");
};


  const Tooltip = ({ label }: { label: string }) => (
    <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-emerald-800 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap z-[9999] opacity-0 group-hover:opacity-100 transition">
      {label}
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-16 bg-green-300 bg-opacity-50 flex-col items-center py-4 space-y-6 shadow-md">
        <div className="flex flex-col items-center space-y-6 flex-grow">
          <Link to="/chat/setting/profile" className="w-10 h-10 rounded-full bg-white overflow-hidden">
            <img src={user} alt="Avatar" className="object-cover w-full h-full" />
          </Link>

          <Link to={chatRoute}>
            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center">
              <MessageCircle className="text-white" />
            </button>
          </Link>

          <Link to="/home">
            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center">
              <Home className="text-white" />
            </button>
          </Link>

          <Link to="/home#therapy">
            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center">
              <Brain className="text-white" />
            </button>
          </Link>

          <Link to="/therapy/all-doctors">
            <button className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center">
              <Heart className="text-white" />
            </button>
          </Link>
        </div>

        {/* SETTINGS + UNSUBSCRIBE */}
        <div className="space-y-6" ref={settingsRef}>
          <div className="group relative">
            <button
              onClick={() => setShowUnsubscribeModal(true)}
              className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center"
            >
              <UserMinus className="text-white" />
            </button>
            <Tooltip label="Unsubscribe" />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center"
            >
              <Settings className="text-white" />
            </button>

            {showSettings && (
              <div className="absolute left-12 bottom-[-40px] bg-white rounded-xl shadow-lg py-2 w-40">
                <Link to="/chat/setting/profile" className="block px-4 py-1">Profile</Link>
                <Link to="/chat/setting/account" className="block px-4 py-1">Account</Link>
                <Link to="/chat/setting/security" className="block px-4 py-1">Security</Link>
              </div>
            )}
          </div>

          <button onClick={handleLogout} className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center">
            <LogOut className="text-white" />
          </button>
        </div>
      </div>

      {/* MOBILE TOP BAR */}
      <div className="flex md:hidden justify-end px-4 py-3 bg-green-200">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* UNSUBSCRIBE MODAL */}
      {showUnsubscribeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Confirm Unsubscribe</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to unsubscribe? This action will cancel your
              subscription and log you out.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowUnsubscribeModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUnsubscribe}
                disabled={unsubscribeLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                {unsubscribeLoading ? "Unsubscribing..." : "Yes, Unsubscribe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
