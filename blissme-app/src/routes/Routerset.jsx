import { Routes, Route, Navigate } from "react-router-dom";
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
import BreathingExercise from "../app/therapy/BreathingExercise";
import { AnxietyGames } from "../app/therapy/Anxiety_Games";
import MeditationPlayer from "../app/therapy/MeditationPlayer";
import MoodTracker from "../app/therapy/MoodTracker";
import TherapyLayout from "../app/layouts/TherapyLayout";
import MoodTrackerMain from "../app/therapy/MoodTrackerMain";
import LogMood from "../app/therapy/LogMood";
import MoodLayout from "../app/layouts/MoodLayout";
import DashLayout from "../app/layouts/DashLayout";
import AnxietyLayout from "../app/layouts/AnxietyLayout";
import NumberGuessingGame from "../app/therapy/Game/guessing_f/NumberGuessingGame";
import GameLayout from "../app/layouts/GameLayout";
import DoctorDashboard from "../app/dashboard/DoctorDashboard";
import DashboardLayout from "../app/layouts/DashboardLayout";
import BodyScan from "../app/features/BodyScan";

import Songs from "../app/features/Songs";
import Doctors from "../app/features/Doctors";
import Level from "../app/start/Level";
import Medicine from "../app/start/Medicine";
import { ZenGarden } from "../app/therapy/zen-garden";
import ForestLayout from "../app/layouts/ForestLAyout";
import { ForestGame } from "../app/therapy/forest-game";
import { OceanWaves } from "../app/therapy/ocean-waves";
import OceanLayout from "../app/layouts/OceanLayout";

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
      <Route path="/songs" element={<Songs />} />
      <Route path="/doctors" element={<Doctors />} />

      {token !== null && token !== "" ? (
        <>
          <Route path="/mode" element={<ModelLayout />}>
            <Route path="nick-name" element={<Nickname />} />
            <Route path="virtual-character" element={<VirtualCharacter />} />
            <Route path="input-mode" element={<InputMode />} />
            <Route path="level" element={<Level />} />
            <Route path="medicine" element={<Medicine />} />

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
          <Route path="/therapy" element={<TherapyLayout />}>
            <Route path="breathing" element={<BreathingExercise />} />
            <Route path="zen" element={<ZenGarden />} />
            <Route path="forest" element={<ForestGame />} />
            <Route path="ocean" element={<OceanWaves />} />
            <Route path="mood-tracker" element={<MoodTracker />} />

            <Route path="medication" element={<MeditationPlayer />} />
            <Route path="mood-tracker-home" element={<MoodTrackerMain />} />
            <Route path="all-songs" element={<Songs />} />
            <Route path="all-doctors" element={<Doctors />} />
            <Route path="body-scan" element={<BodyScan />} />

          </Route>
          <Route path="/game" element={<GameLayout />}>
            <Route path="therapy_game" element={<NumberGuessingGame />} />
          </Route>
          {/* <Route path="/dash" element={<AnxietyLayout />}>
            <Route path="anxiety" element={<AnxietyGames />} />
            <Route path="zen" element={<ZenGarden />} />
          </Route> */}
          {/* <Route path="/dash" element={<ForestLayout />}>
            <Route path="forest" element={<ForestGame />} />
          </Route>
          <Route path="/dash" element={<OceanLayout />}>
            <Route path="ocean" element={<OceanWaves />} />
          </Route> */}
          {/* <Route path="/dash" element={<DashLayout />}>
            <Route path="mood-tracker" element={<MoodTracker />} />
          </Route> */}
          <Route path="/mood" element={<MoodLayout />}>
            <Route path="step1" element={<LogMood />} />
          </Route>
          <Route path="/doctor" element={<DashboardLayout />}>
            <Route path="dash" element={<DoctorDashboard />} />
          </Route>
        </>
      ) : (
        <Route path="*" element={<Navigate to="/sign-in" />} />
      )}
    </Routes>
  );
};

export default Routerset;
