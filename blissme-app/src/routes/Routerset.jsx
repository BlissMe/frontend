import { Routes, Route } from "react-router-dom";
import SignUp from "../app/signUp/SignUp";
import SignIn from "../app/signIn/SignIn";
import ChatBox from "../app/chatBox/ChatBox";
import MainLayout from "../app/layouts/MainLayout";

const Routerset = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="/chat" element={<ChatBox />} />
      </Route>
    </Routes>
  );
};

export default Routerset;
