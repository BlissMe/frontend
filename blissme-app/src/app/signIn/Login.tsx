import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
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
  const handleLogoClick = () => navigate("/home");
  const API_URL = process.env.REACT_APP_API_URL;

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const userData = {
        email: values.email,
        password: values.password,
      };

      const response = await userSignInService(userData);
      console.log("re", response);

      if (response.message === "Login successful") {
        openNotification("success", "Login Successful", "Welcome back!");

        setToken(response.token);
        setLocalStorageData("token", response.token);
        setLocalStorageData("user", response.email);
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
      console.error("Login error:", error);

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
      className="relative z-0 min-h-screen w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bg7})` }}
    >
      <div className="fixed top-4 left-4 z-20">
        <img
          onClick={handleLogoClick}
          src={logo}
          alt="Logo"
          className="h-10 w-auto cursor-pointer"
        />
      </div>
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 w-full md:w-1/2 max-w-[500px] py-1 bg-white rounded-xl shadow-lg">
          {/* Message Bubble on top */}
          <MessageBubble />

          {/* Form & other content below */}
          <div className="flex flex-col items-center w-full ">
            <div className="flex flex-col items-center w-full gap-1 mb-2">
              <Text
                className="text-black text-2xl md:text-3xl font-semibold "
                style={{ fontFamily: "Merienda, cursive" }}
              >
                Welcome Again
              </Text>
              <Text
                className="text-[15px] font-normal text-center"
                style={{ fontFamily: "Merienda, cursive" }}
              >
                Welcome back! Your AI buddy is ready to chat!
              </Text>
            </div>
          </div>

          <div className="flex flex-col items-center w *:-full ">
            <Form
              layout="vertical"
              className="w-[380px] sm:w-[400px]"
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                label="Email "
                className="custom-label"
                required={false}
                rules={[
                  { required: true, message: "Email is required!" },
                  { type: "email", message: "Email is invalid!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  onKeyDown={(e) => {
                    const key = e.key;
                    if (!/^[A-Za-z.@0-9]*$/.test(key) && key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                  size="large"
                  maxLength={100}
                  autoComplete="off"
                  className="w-full custom-input rounded-none"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password "
                className="custom-label"
                required={false}
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
                  className="w-full custom-input"
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-4">
                <Form.Item name="rememberme" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Text
                  className="text-textColorTwo cursor-pointer text-sm hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </Text>
              </div>

              <Form.Item>
                <div className="flex justify-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full md:w-[300px] h-[45px] text-base md:text-lg rounded-full text-white font-bold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
                    loading={loading}
                  >
                    Sign In
                  </Button>
                </div>
              </Form.Item>
            </Form>
            <div className="flex items-center justify-center mb-2">
              <div className="w-20 h-px bg-gray-400"></div>
              <span className="px-3 text-sm text-black whitespace-nowrap">
                Signin With Others
              </span>
              <div className="w-20 h-px bg-gray-400"></div>
            </div>
            <Button
              type="default"
              className="google_btn flex items-center gap-4 mt-3"
              onClick={() => navigate("/face-auth")}
            >
              <img
                src={assets.face_recognition}
                alt="face icon"
                className="w-6 h-6"
              />
              Sign in with Face
            </Button>
            <Form>
              <Form.Item>
                <div className="flex justify-center">
                  <Button
                    type="primary"
                    className="google_btn flex items-center gap-2"
                    onClick={googleAuth}
                  >
                    <img
                      src={assets.google}
                      alt="google icon"
                      className="w-5 h-5"
                    />
                    Sign in with Google
                  </Button>
                </div>
              </Form.Item>

              <Text className="block text-center text-sm md:text-base text-textColorOne mb-2">
                Don’t have an account?{" "}
                <span
                  className="text-textColorTwo cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </span>
              </Text>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
