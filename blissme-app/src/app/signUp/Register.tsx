import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography, Modal } from "antd";
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
    try {
      setLoading(true);
      const userData = {
        username: values.username,
        password: values.password,
        authType: "normal",
      };

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
          response.message || "Signup failed.Please try again later"
        );
      }
    } catch (error: any) {
      console.error("signup error:", error);

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
      style={{ backgroundImage: `url(${bg6})` }}
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
        <div className="flex flex-col items-center gap-2 w-full md:w-1/2 max-w-[500px] py-8 bg-white rounded-xl shadow-lg">
          <MessageBubble />

          <div className="flex flex-col items-center w-full ">
            <div className="flex flex-col items-center w-full gap-1 mb-2">
              <Text
                className="text-black text-2xl md:text-3xl font-semibold"
                style={{ fontFamily: "Merienda, cursive" }}
              >
                Register
              </Text>
              <Text
                className="text-[15px] font-normal text-center"
                style={{ fontFamily: "Merienda, cursive" }}
              >
                Let’s get you started with your friendly AI buddy!
              </Text>
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            <Form
              layout="vertical"
              form={form}
              className="w-[380px] sm:w-[400px]"
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                label="Username"
                className="custom-label"
                rules={[
                  { validator: validateUsername },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="username"
                  size="large"
                  maxLength={100}
                  className="w-full custom-input rounded-none"
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
                  className="w-full custom-input"
                />
              </Form.Item>

              <Form.Item name="scrolledToBottom" initialValue={false} hidden>
                <input type="hidden" />
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
                        return Promise.reject(
                          "Please scroll and read all terms"
                        );
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Checkbox disabled={!form.getFieldValue("scrolledToBottom")}>
                  I agree to the{" "}
                  <span
                    className="text-textColorTwo cursor-pointer underline"
                    onClick={() => setModalVisible(true)}
                  >
                    Terms & Privacy Policy
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <div className="flex justify-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full md:w-[300px] h-[45px] text-base md:text-lg rounded-full text-white font-bold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
                    loading={loading}
                  >
                    Sign Up
                  </Button>
                </div>
              </Form.Item>
            </Form>

            <Form>
              <div className="flex justify-center mb-2">
                <Text className="text-center text-black text-sm">or</Text>
              </div>
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
                    Sign up with Google
                  </Button>
                </div>
              </Form.Item>

              <Text className="block text-center text-sm md:text-base text-textColorOne">
                Already have an account?{" "}
                <span
                  className="text-textColorTwo cursor-pointer"
                  onClick={() => navigate("/sign-in")}
                >
                  Sign In
                </span>
              </Text>
            </Form>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      <Modal
        title="Terms & Conditions and Privacy Policy"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => setModalVisible(false)}
        okButtonProps={{ disabled: !scrolledToBottom }}
        bodyStyle={{ padding: 0 }} // remove default padding
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
            before using our services. By clicking “I Agree”, you consent to the
            following:
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
                  For mild to moderate depression, the app provides non-clinical
                  therapeutic support such as Cognitive Behavioral Therapy
                  (CBT)-based exercises and mindfulness techniques.
                </li>
                <li>
                  For severe depression, the app will not provide therapy.
                  Instead, you will be given options to contact a mental health
                  consultant or emergency services for professional assistance.
                </li>
              </ul>
            </li>

            <li>
              <strong className="text-[#207F6A] text-lg font-semibold">
                Information We Collect
              </strong>
              <p>
                To assess your emotional state and depression level, we collect:
              </p>
              <ul className="list-disc list-inside ml-5 space-y-1 mt-2">
                <li>Text and voice inputs</li>
                <li>Responses to the Patient Health Questionnaire-9 (PHQ-9)</li>
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
                <li>To recommend professional consultation in severe cases</li>
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
                <li>All interaction data is securely stored and encrypted.</li>
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
              <p>If a severe depression level or self-harm risk is detected:</p>
              <ul className="list-disc list-inside ml-5 space-y-1 mt-2">
                <li>The app will not attempt therapy</li>
                <li>
                  You will be given immediate options to contact a licensed
                  consultant or emergency helpline for professional help
                </li>
              </ul>
            </li>

            <li>
              <strong className="text-[#207F6A] text-lg font-semibold">
                Your Rights
              </strong>
              <ul className="list-disc list-inside ml-5 space-y-1 mt-2">
                <li>You may request deletion of your data at any time</li>
                <li>You may withdraw consent and stop using the app anytime</li>
                <li>You may review how your data is processed and stored</li>
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
                  You voluntarily provide your data for depression detection and
                  guidance
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
      </Modal>
    </div>
  );
};

export default Register;
