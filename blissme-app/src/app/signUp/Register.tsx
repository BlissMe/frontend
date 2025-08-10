import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  message,
  Modal,
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { assets } from "../../assets/assets";
import { userSignUpService } from "../../services/UserService";
import { passwordFieldValidation } from "../../helpers/PasswordValidation";
import { AuthContext } from "../context/AuthContext";
import { setLocalStorageData } from "../../helpers/Storage";
import "../../index.css";
import MessageBubble from "../../components/Background/MessageBubble";
import bg6 from "../../assets/images/b6.jpeg";
import { useNotification } from "../context/notificationContext";

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

  const handleScroll = () => {
    const el = contentRef.current;
    if (el && el.scrollHeight - el.scrollTop <= el.clientHeight + 10) {
      setScrolledToBottom(true);
      form.setFieldsValue({ scrolledToBottom: true });
    }
  };

  interface RegisterFormValues {
    email: string;
    password: string;
    scrolledToBottom: boolean;
    agree: boolean;
  }

  interface UserSignUpData {
    email: string;
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
        email: values.email,
        password: values.password,
        authType: "normal",
      };

      const response = await userSignUpService(userData);

      if (response.message === "Successfully Registered") {
        openNotification("success", "Signup Successful", "Welcome!");
        setToken(response?.token);
        setLocalStorageData("token", response?.token);
        setLocalStorageData("user", response?.email);
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
    window.open(`http://localhost:8080/auth/google`, "_self");
  };

  return (
    <div
      className="relative z-0 min-h-screen w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bg6})` }}
    >
      <div className="min-h-screen w-full flex items-center justify-center relative z-10">
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
                name="email"
                label="Email"
                className="custom-label"
                rules={[
                  { required: true, message: "Email is required!" },
                  { type: "email", message: "Email is invalid!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  size="large"
                  maxLength={100}
                  autoComplete="off"
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
      >
        <div
          ref={contentRef}
          onScroll={handleScroll}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            padding: "16px",
            border: "1px solid #ccc",
            fontFamily: "Roboto, sans-serif",
            fontSize: "13px",
            lineHeight: "1.6",
          }}
        >
          <p style={{ fontWeight: "bold" }}>Terms and Conditions</p>
          <p>Lorem ipsum dolor sit amet... [Add your content here]</p>
          <p>
            hguhsgfds yugeyfuw seufen ssesnds bdnsye wned syfsyufysu fshghfsgdf
            gsdhsg{" "}
          </p>
          <p>
            hguhsgfds yugeyfuw seufen ssesnds bdnsye wned syfsyufysu fshghfsgdf
            gsdhsg{" "}
          </p>
          <p>
            hguhsgfds yugeyfuw seufen ssesnds bdnsye wned syfsyufysu fshghfsgdf
            gsdhsg{" "}
          </p>

          <p style={{ fontWeight: "bold" }}>Privacy Policy</p>
          <p>Your data is confidential... [Add your content here]</p>
          <p>
            hguhsgfds yugeyfuw seufen ssesnds bdnsye wned syfsyufysu fshghfsgdf
            gsdhsg{" "}
          </p>
          <p>
            hguhsgfds yugeyfuw seufen ssesnds bdnsye wned syfsyufysu fshghfsgdf
            gsdhsg{" "}
          </p>
          <p>...</p>

          <p>
            <em>Scroll to the bottom to enable acceptance.</em>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Register;
