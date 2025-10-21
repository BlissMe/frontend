import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { passwordFieldValidation } from "../../helpers/PasswordValidation";
import { AuthContext } from "../context/AuthContext";
import { setLocalStorageData } from "../../helpers/Storage";
import "../../index.css";
import { userSignInService } from "../../services/UserService";
import MessageBubble from "../../components/Background/MessageBubble";
import bg7 from "../../assets/images/b7.jpeg";
import { useNotification } from "../context/notificationContext";
import { getUserPreferences } from "../../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { assets } from "../../assets/assets";
import logo from "../../assets/images/logo.png";

const { Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const { openNotification } = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogoClick = () => navigate("/home");

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const userData = {
        username: values.username,
        password: values.password,
      };

      const response = await userSignInService(userData);

      if (response.message === "Login successful") {
        openNotification("success", "Login Successful", "Welcome back!");

        setToken(response.token);
        setLocalStorageData("token", response.token);
        setLocalStorageData("user", response.username);
        setLocalStorageData("userId", response?.userID);

        await dispatch(getUserPreferences());
        navigate("/mode/input-mode", { replace: true });
      } else {
        openNotification(
          "error",
          "Login Failed",
          response.message || "Login failed. Please try again later"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again later.";
      openNotification("error", "Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = () => {
    window.open(`${API_URL}/auth/google`, "_self");
  };

  return (
    <div
      className="relative z-0 min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bg7})` }}
    >
      {/* Logo */}
      <div className="absolute top-4 left-4 z-20">
        <img
          onClick={handleLogoClick}
          src={logo}
          alt="Logo"
          className="h-8 sm:h-10 md:h-12 w-auto cursor-pointer"
        />
      </div>

      {/* Main Content Card */}
      <div className="z-10 flex flex-col items-center w-full max-w-[420px] sm:max-w-[500px] lg:max-w-[550px] p-6 sm:p-8 bg-white/40 rounded-xl shadow-xl m-4 justify-center overflow-hidden">
        <MessageBubble />

        {/* Header */}
        <div className="flex flex-col items-center mb-3 text-center">
          <Text
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-black"
            style={{ fontFamily: "Merienda, cursive" }}
          >
            Welcome Again
          </Text>
          <Text
            className="text-sm sm:text-base text-gray-700 mt-1"
            style={{ fontFamily: "Merienda, cursive" }}
          >
            Welcome back! Your AI buddy is ready to chat!
          </Text>
        </div>

        {/* Form */}
        <Form
          layout="vertical"
          className="w-full"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="Username"
            className="custom-label"
            rules={[{ required: true, message: "Username is required!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
              maxLength={100}
              className="w-full rounded-md bg-gray-100 placeholder-lime-500"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            className="custom-label"
            rules={[
              { required: true, message: "Password is required!" },
              { validator: passwordFieldValidation },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              placeholder="Password"
              maxLength={60}
              className="w-full rounded-md bg-gray-100 placeholder-lime-500"
            />
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <Form.Item name="rememberme" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Text
              className="text-[#2CA58D] cursor-pointer text-sm hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Text>
          </div>

          <div className="flex justify-center mt-2">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full sm:w-[80%] md:w-[70%] h-[42px] text-base md:text-lg rounded-xl text-white font-semibold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
              loading={loading}
            >
              Sign In
            </Button>
          </div>
        </Form>

        {/* Divider */}
        <div className="flex items-center justify-center my-3 w-full">
          <div className="border-t border-gray-300 w-1/4"></div>
          <Text className="mx-2 text-sm text-gray-600">or</Text>
          <div className="border-t border-gray-300 w-1/4"></div>
        </div>

        {/* Google and Face Sign In */}
        <Button
          type="primary"
          className="google_btn flex items-center justify-center gap-2 w-full sm:w-[80%] md:w-[70%] h-[42px] rounded-full font-medium"
          onClick={() => navigate("/face-auth")}
        >
          <img src={assets.face_recognition} alt="face icon" className="w-6 h-6" />
          Sign in with Face
        </Button>

        <Button
          type="primary"
          className="google_btn flex items-center justify-center gap-2 w-full sm:w-[80%] md:w-[70%] h-[42px] rounded-full mt-2 font-medium"
          onClick={googleAuth}
        >
          <img src={assets.google} alt="google icon" className="w-5 h-5" />
          Sign in with Google
        </Button>

        <Text className="mt-3 text-center text-sm md:text-base text-gray-700">
          Don’t have an account?{" "}
          <span
            className="text-[#2CA58D] cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </Text>
      </div>
    </div>
  );
};

export default Login;
