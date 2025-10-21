import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography, Modal, Select } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { assets } from "../../assets/assets";
import { userSignUpService } from "../../services/UserService";
import {
  passwordFieldValidation,
  validateUsername,
} from "../../helpers/PasswordValidation";
import { AuthContext } from "../context/AuthContext";
import { setLocalStorageData } from "../../helpers/Storage";
import "../../index.css";
import MessageBubble from "../../components/Background/MessageBubble";
import bg6 from "../../assets/images/b6.jpeg";
import { useNotification } from "../context/notificationContext";
import logo from "../../assets/images/logo.png";

const { Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const { openNotification } = useNotification();
  const API_URL = process.env.REACT_APP_API_URL;
  const [stepOneValues, setStepOneValues] = useState({
    username: "",
    password: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const next = () => setCurrentStep(2);
  const prev = () => setCurrentStep(1);

  const handleScroll = () => {
    const el = contentRef.current;
    if (el && el.scrollHeight - el.scrollTop <= el.clientHeight + 10) {
      setScrolledToBottom(true);
      form.setFieldsValue({ scrolledToBottom: true });
    }
  };

  const handleLogoClick = () => navigate("/home");

  interface RegisterFormValues {
    username: string;
    password: string;
    scrolledToBottom: boolean;
    agree: boolean;
  }

  interface UserSignUpData {
    username: string;
    password: string;
    authType: string;
  }

  interface UserSignUpResponse {
    message?: string;
    token?: string;
  }

  const onFinish = async (values: any) => {
    if (currentStep === 1) {
      setStepOneValues({
        username: values.username,
        password: values.password,
      });
      next();
    } else if (currentStep === 2) {
      const userData = {
        ...stepOneValues,
        securityQuestion: values.securityQuestion,
        securityAnswer: values.securityAnswer,
        authType: "normal",
      };

      try {
        setLoading(true);
        const response = await userSignUpService(userData);

        if (response.message === "Successfully Registered") {
          openNotification("success", "Signup Successful", "Welcome!");
          setToken(response?.token);
          setLocalStorageData("token", response?.token);
          setLocalStorageData("user", response?.username);
          setLocalStorageData("userId", response?.userID);
          setLocalStorageData("isSignUp", true);
          navigate("/mode/nick-name", { replace: true });
        } else {
          openNotification(
            "error",
            "Signup Failed",
            response.message || "Signup failed. Please try again later"
          );
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again later.";
        openNotification("error", "Signup Failed", errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const googleAuth = () => {
    window.open(`${API_URL}/auth/google`, "_self");
  };

  return (
    <div
      className="relative z-0 min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bg6})` }}
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
      <div className="z-10 flex flex-col items-center w-full max-w-[420px] sm:max-w-[500px] lg:max-w-[550px] p-6 sm:p-8 bg-white/40 rounded-xl shadow-xl backdrop-blur-md">
        <MessageBubble />

        {/* Header */}
        <div className="flex flex-col items-center mb-3 text-center">
          <Text
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-black"
            style={{ fontFamily: "Merienda, cursive" }}
          >
            Register
          </Text>
          <Text
            className="text-sm sm:text-base text-gray-700 mt-1"
            style={{ fontFamily: "Merienda, cursive" }}
          >
            Let’s get you started with your friendly AI buddy!
          </Text>
        </div>

        {/* Form */}
        <Form
          layout="vertical"
          form={form}
          className="w-full"
          onFinish={onFinish}
        >
          {currentStep === 1 && (
            <>
              <Form.Item
                name="username"
                label="Username"
                className="custom-label"
                rules={[
                  { required: true, message: "Username is required!" },
                  { validator: validateUsername },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="username"
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
                  className="w-full rounded-md  bg-gray-100 placeholder-lime-500"
                />
              </Form.Item>

              <div className="flex justify-center mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full sm:w-[80%] md:w-[70%] h-[42px] text-base md:text-lg rounded-xl text-white font-semibold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Form.Item
                name="securityQuestion"
                label="Security Question"
                rules={[{ required: true, message: "Please select a question" }]}
              >
                <Select placeholder="Select a security question" size="large">
                  <Select.Option value="first_school">
                    What was your first school?
                  </Select.Option>
                  <Select.Option value="pet_name">
                    What is your pet’s name?
                  </Select.Option>
                  <Select.Option value="birth_city">
                    In which city were you born?
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="securityAnswer"
                label="Security Answer"
                rules={[{ required: true, message: "Please provide an answer" }]}
              >
                <Input
                  size="large"
                  placeholder="Your Answer"
                  maxLength={100}
                  className="w-full rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="agree"
                valuePropName="checked"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value)
                        return Promise.reject("You must agree to terms");
                      if (!getFieldValue("scrolledToBottom"))
                        return Promise.reject("Scroll and read all terms");
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <Checkbox disabled={!form.getFieldValue("scrolledToBottom")}>
                    I agree to the{" "}
                    <span
                      className="text-[#2CA58D] underline cursor-pointer"
                      onClick={() => setModalVisible(true)}
                    >
                      Terms & Privacy Policy
                    </span>
                  </Checkbox>
                  <span
                    className="text-[#2CA58D] cursor-pointer hover:text-black text-sm"
                    onClick={prev}
                  >
                    ← Back
                  </span>
                </div>
              </Form.Item>

              <div className="flex justify-center mt-3">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full sm:w-[80%] md:w-[70%] h-[42px] text-base md:text-lg rounded-full text-white font-semibold bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
                >
                  Sign Up
                </Button>
              </div>
            </>
          )}
        </Form>

        {/* Divider */}
       {/*  <div className="flex items-center justify-center my-3 w-full">
          <div className="border-t border-gray-300 w-1/4"></div>
          <Text className="mx-2 text-sm text-gray-600">or</Text>
          <div className="border-t border-gray-300 w-1/4"></div>
        </div> */}

        {/* Google Sign Up */}
       {/*  <Button
          type="primary"
          className="google_btn flex items-center justify-center gap-2 w-full sm:w-[80%] md:w-[70%] h-[42px] rounded-full font-medium"
          onClick={googleAuth}
        >
          <img src={assets.google} alt="google icon" className="w-5 h-5" />
          Sign up with Google
        </Button> */}

        <Text className="mt-3 text-center text-sm md:text-base text-gray-700">
          Already have an account?{" "}
          <span
            className="text-[#2CA58D] cursor-pointer hover:underline"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </span>
        </Text>
      </div>

      {/* Responsive Modal */}
      <Modal
        title="Terms & Conditions and Privacy Policy"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => setModalVisible(false)}
        okButtonProps={{ disabled: !scrolledToBottom }}
        bodyStyle={{
          padding: 0,
          maxHeight: "65vh",
          overflowY: "auto",
        }}
        centered
      >
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="px-6 py-4 bg-gray-50 text-gray-800 text-sm sm:text-base leading-relaxed"
        >
          
        </div>
      </Modal>
    </div>

  );
};

export default Register;
