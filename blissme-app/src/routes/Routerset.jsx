import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "../app/signUp/SignUp";
import SignIn from "../app/signIn/SignIn";
import ChatBox from "../app/chatBox/ChatBox";
import MainLayout from "../app/layouts/MainLayout";
import VoiceChatBox from "../app/chatBox/VoiceChatBox";
import Nickname from "../app/start/Nickname";
import VirtualCharacter from "../app/start/VirtualCharacter";
import InputMode from "../app/start/InputMode";
import { AuthContext } from "../app/context/AuthContext";
import { useContext } from "react";
import SendEmail from "../app/forget-password/SendEmail";
import ResetPassword from "../app/forget-password/ResetPassword";
import Mood from "../app/start/Mood";

const Routerset = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<SignUp />} />

      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/forgot-password" element={<SendEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/mood" element={<Mood />} />

      {token !== null && token !== "" ? (
        <>
          <Route path="/nick-name" element={<Nickname />} />
          <Route path="/virtual-character" element={<VirtualCharacter />} />
          <Route path="/input-mode" element={<InputMode />} />
          <Route path="/chat" element={<MainLayout />}>
            <Route path="text" element={<ChatBox />} />
            <Route path="voice" element={<VoiceChatBox />} />
          </Route>
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default Routerset;