import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "../app/signUp/SignUp";
import SignIn from "../app/signIn/SignIn";
import ChatBox from "../app/chatBox/ChatBox";
import MainLayout from "../app/layouts/MainLayout";
import FrontPage from "../app/chatBox/FrontPage";
import VoiceChatBox from "../app/chatBox/VoiceChatBox";
import OnBordingLayout from "../app/layouts/OnBordingLayout";
import { AuthContext } from "../app/context/AuthContext";
import { useContext } from "react";

const Routerset = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<SignUp />} />

      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      {token !== null && token !== "" ? (
        <>
          <Route path="/onbording" element={<OnBordingLayout />}>
            <Route path="profile" element={<FrontPage />} />
          </Route>

          <Route path="/chat" element={<MainLayout />}>
            <Route path="text" element={<ChatBox />} />
            <Route path="voice" element={<VoiceChatBox />} />
          </Route>
        </>
      ) : (
        <Route path="/chat" element={<MainLayout />}>
          <Route path="text" element={<ChatBox />} />
          <Route path="voice" element={<VoiceChatBox />} />
        </Route>
      )}
    </Routes>
  );
};

export default Routerset;
