import { Routes, Route } from "react-router-dom";
import SignUp from "../app/signUp/SignUp";
import SignIn from "../app/signIn/SignIn";
import ChatBox from "../app/chatBox/ChatBox";
import MainLayout from "../app/layouts/MainLayout";
import FrontPage from "../app/chatBox/FrontPage";
import VoiceChatBox from "../app/chatBox/VoiceChatBox";
import OnBordingLayout from "../app/layouts/OnBordingLayout";
import Nickname from "../app/start/Nickname";
import VirtualCharacter from "../app/start/VirtualCharacter";
import InputMode from "../app/start/InputMode";

const Routerset = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/nick-name" element={<Nickname />} />
      <Route path="/virtual-character" element={<VirtualCharacter />} />
      <Route path="/input-mode" element={<InputMode />} />

      <Route path="/onbording" element={<OnBordingLayout />}>
        <Route path="profile" element={<FrontPage />} />
      </Route>

      <Route path="/chat" element={<MainLayout />}>
        <Route path="text" element={<ChatBox />} />
        <Route path="voice" element={<VoiceChatBox />} />
      </Route>
    </Routes>
  );
};

export default Routerset;
