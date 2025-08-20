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
import ModelLayout from "../app/layouts/ModelLayout";
import Register from "../app/signUp/Register";
import Login from "../app/signIn/Login";
import Landing from "../app/start/Landing";
import Home from "../app/start/Home";
import Setting from "../app/settings/Setting";
import ProfileSetting from "../components/Sidebar/ProfileSetting";
import AccountSetting from "../components/Sidebar/AccountSetting";
import SecuritySetting from "../components/Sidebar/SecuritySetting";
import FaceSignin from "../app/signIn/FaceSignIn";
import Chat from "../app/chatBox/Chat";
import SettingsLayout from "../app/layouts/SettingsLayout";
import VoiceChat from "../app/chatBox/VoiceChat";

const Routerset = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} /> */}
      <Route path="/forgot-password" element={<SendEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/register" element={<Register />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/face-auth" element={<FaceSignin />} />
      {token !== null && token !== "" ? (
        <>
          <Route path="/mode" element={<ModelLayout />}>
            <Route path="nick-name" element={<Nickname />} />
            <Route path="virtual-character" element={<VirtualCharacter />} />
            <Route path="input-mode" element={<InputMode />} />

            {/*<Route path="mood" element={<Mood />} />*/}

          </Route>
          <Route path="/chats" element={<MainLayout />}>
            <Route path="text" element={<ChatBox />} />
            <Route path="voice" element={<VoiceChatBox />} />
            <Route path="setting" element={<Setting />} />
            {/* <Route path="setting/profile" element={<ProfileSetting />} />
            <Route path="setting/account" element={<AccountSetting />} />
            <Route path="setting/security" element={<SecuritySetting />} /> */}
          </Route>
          <Route path="chat-new/text" element={<Chat />} />
          <Route path="chat-new/voice" element={<VoiceChat />} />

          <Route path="/chat" element={<SettingsLayout />}>
            <Route path="setting/profile" element={<ProfileSetting />} />
            <Route path="setting/account" element={<AccountSetting />} />
            <Route path="setting/security" element={<SecuritySetting />} />
          </Route>
        </>
      ) : (
        <Route path="*" element={<Navigate to="/sign-in" />} />
      )}
    </Routes>
  );
};

export default Routerset;
