import { useState } from "react";
import { Input, Button } from "antd";
import heart from "../../assets/images/heart.png";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPreferencesSuccess } from "../../redux/reducers/userReducer";
import { useNotification } from "../context/notificationContext";

const Nickname = () => {
  const [nickname, setNicknameInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openNotification } = useNotification();

  const handleNext = () => {
    if (!nickname.trim()) {
      openNotification("warning", "Nickname is required");
      return;
    }

    dispatch(
      setPreferencesSuccess({ nickname, virtualCharacter: 1, inputMode: "" })
    );
    openNotification("success", "Nickname saved successfully");
    navigate("/mode/virtual-character");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="z-10 bg-[#BDF2D0] bg-opacity-10 backdrop-blur-md rounded-2xl p-8 w-[90%] max-w-md text-center shadow-xl border border-white/20 relative">
        <div className="flex flex-col items-center mb-0">
          <img src={logo} alt="BlissMe Logo" className="w-34 h-12" />
        </div>

        <h3 className="text-black text-xl md:text-2xl mb-2">
          Welcome to BlissMe App
        </h3>

        <div className="relative flex flex-col items-center mb-8 mt-6">
          <img
            src={heart}
            alt="Heart"
            className="w-34 h-16 animate-wiggle animate-infinite"
          />

          <Input
            placeholder="Choose a nickname"
            value={nickname}
            onChange={(e) => setNicknameInput(e.target.value)}
            className="absolute bottom-[-35%] w-[80%] rounded-lg py-2 bg-[#DCF2DE] shadow-md text-center 
                       border border-transparent focus:border-[#BDF2D0] hover:border-[#BDF2D0] focus:ring-0"
          />
        </div>

        <Button
          type="default"
          onClick={handleNext}
          className="bg-[#4B9B6E] hover:bg-[#1B5E3A] text-white border-none shadow-md"
          //disabled={!nickname.trim()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Nickname;
