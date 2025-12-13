import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography, Modal, Select } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { assets } from "../../assets/assets";
import { userSignUpService } from "../../services/UserService";
import { passwordFieldValidation } from "../../helpers/PasswordValidation";
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
          //navigate("/mode/nick-name", { replace: true });
          navigate("/price", { replace: true });
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
                rules={[{ required: true, message: "Username is required!" }]}
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
                <button
                  // type="primary"
                  // htmlType="submit"
                  className="w-full sm:w-[80%] md:w-[70%] h-[42px] text-base md:text-lg rounded-xl text-white font-semibold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Form.Item
                name="securityQuestion"
                label="Security Question"
                rules={[
                  { required: true, message: "Please select a question" },
                ]}
              >
                <Select placeholder="Select a security question" size="large">
                  <Select.Option value="first_school">
                    What is your favourite color?
                  </Select.Option>
                  <Select.Option value="pet_name">
                    What is your pet’s name?
                  </Select.Option>
                  <Select.Option value="birth_city">
                    What is your favourite country?
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="securityAnswer"
                label="Security Answer"
                rules={[
                  { required: true, message: "Please provide an answer" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Your Answer"
                  maxLength={100}
                  className="w-full !rounded-md"
                />
              </Form.Item>

              <p className="text-sm text-yellow-700 mb-2 italic">
                ⚠️ Please scroll through the Terms & Privacy Policy before
                agreeing.
              </p>
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
                      className="text-[#01201a] underline cursor-pointer"
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
                <button
                  // type="primary"
                  // htmlType="submit"
                  // loading={loading}
                  className="w-full sm:w-[80%] md:w-[70%] h-[42px] text-base md:text-lg rounded-xl text-white font-semibold bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
                >
                  Sign Up
                </button>
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
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="
      max-h-[360px] overflow-y-auto px-8 py-6 border-t-4 border-[#3FBFA8]
      bg-gray-50 font-roboto text-sm leading-relaxed text-gray-800 select-text
      "
          >
            <h2 className="text-[#2CA58D] mb-4 font-extrabold text-xl">
              Consent and Privacy Policy
            </h2>
            <p className="mb-5">
              Welcome to <strong>Bliss Me</strong>. Please read this carefully
              before using our services. By clicking “I Agree”, you consent to
              the following:
            </p>
            <ol className="list-decimal list-inside mb-5 space-y-5">
              <li>
                <strong className="text-[#207F6A] text-lg font-semibold">
                  Purpose of the Application
                </strong>
                <p>
                  Bliss Me uses Artificial Intelligence to detect depression
                  severity through your text and voice inputs.
                </p>
                <ul className="list-disc list-inside ml-5 space-y-1 mt-2">
                  <li>
                    For mild to moderate depression, the app provides
                    non-clinical therapeutic support such as Cognitive
                    Behavioral Therapy (CBT)-based exercises and mindfulness
                    techniques.
                  </li>
                  <li>
                    For severe depression, the app will not provide therapy.
                    Instead, you will be given options to contact a mental
                    health consultant or emergency services for professional
                    assistance.
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-[#207F6A] text-lg font-semibold">
                  Information We Collect
                </strong>
                <p>
                  To assess your emotional state and depression level, we
                  collect:
                </p>
                <ul className="list-disc list-inside ml-5 space-y-1 mt-2">
                  <li>Text and voice inputs</li>
                  <li>
                    Responses to the Patient Health Questionnaire-9 (PHQ-9)
                  </li>
                  <li>Your interaction history within the app</li>
                </ul>
              </li>

              <li>
                <strong className="text-[#207F6A] text-lg font-semibold">
                  How We Use Your Data
                </strong>
                <ul className="list-disc list-inside ml-5 space-y-1 mt-2">
                  <li>
                    To detect depression levels and provide personalized support
                    (for mild to moderate cases)
                  </li>
                  <li>
                    To recommend professional consultation in severe cases
                  </li>
                  <li>To improve our AI model using anonymized data only</li>
                </ul>
              </li>

              <li>
                <strong className="text-[#207F6A] text-lg font-semibold">
                  Data Privacy and Security
                </strong>
                <ul className="list-disc list-inside ml-5 space-y-1 mt-2">
                  <li>
                    Your identity and personal information will never be shared
                    with third parties.
                  </li>
                  <li>
                    All interaction data is securely stored and encrypted.
                  </li>
                  <li>
                    We comply with data protection laws to keep your information
                    safe.
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-[#207F6A] text-lg font-semibold">
                  Emergency and Severe Case Protocol
                </strong>
                <p>
                  If a severe depression level or self-harm risk is detected:
                </p>
                <ul className="list-disc list-inside ml-5 space-y-1 mt-2">
                  <li>The app will not attempt therapy</li>
                  <li>
                    You will be given immediate options to contact a licensed
                    consultant or emergency helpline for professional help.
                  </li>
                </ul>
              </li>

              <li>
                <strong className="text-[#207F6A] text-lg font-semibold">
                  Consent
                </strong>
                <p>By clicking “I Agree”, you confirm that:</p>
                <ul className="list-disc list-inside ml-5 space-y-1 mt-2">
                  <li>
                    You understand Bliss Me provides non-clinical support only
                  </li>
                  <li>
                    You voluntarily provide your data for depression detection
                    and guidance
                  </li>
                  <li>
                    You are at least 18 years old or using the app with
                    parental/guardian consent
                  </li>
                </ul>
              </li>
            </ol>
            <p className="italic text-gray-600 text-center mt-3">
              Scroll to the bottom to enable acceptance.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Register;
