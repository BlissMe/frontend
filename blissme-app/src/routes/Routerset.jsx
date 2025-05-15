import { Routes, Route } from "react-router-dom";
import SignUp from "../app/signUp/SignUp";
import SignIn from "../app/signIn/SignIn";

const Routerset = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
    </Routes>
  );
};

export default Routerset;
