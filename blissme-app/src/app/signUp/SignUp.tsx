import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import signup from "../../assets/images/signup.jpg";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { assets } from "../../assets/assets";
import { userSignUpService } from "../../services/UserService";
import { passwordFieldValidation, validateUsername } from "../../helpers/PasswordValidation";
import { AuthContext } from "../context/AuthContext";
import { setLocalStorageData } from "../../helpers/Storage";
import { useNotification } from "../context/notificationContext";

const { Text } = Typography;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const { openNotification } = useNotification();
  const API_URL = process.env.REACT_APP_API_URL;

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
    <>
      <div className="flex h-screen flex-col md:flex-row">
        <div className="block md:block w-full md:w-1/2 h-72 md:h-full">
          <img
            src={signup}
            alt="Signup"
            className="w-full h-full object-cover md:object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-4 items-center justify-center w-full md:w-1/2 h-full px-4 md:py-8 bg-gradient-to-b from-[#FFFFFF] to-[#5FB57F]">
          <div className="flex flex-col items-center w-full gap-2 md:mt-6">
            <Text className="text-black text-2xl md:text-3xl font-semibold">
              Register
            </Text>
            <Text className="text-textColorOne text-sm md:text-base font-normal block text-center">
              Let’s get you started with your friendly AI buddy!
            </Text>
          </div>
          <div className="flex flex-col items-center w-full max-w-[400px]">
            <Form layout="vertical" className="w-full" onFinish={onFinish}>
              <Form.Item
                name="username"
                label="Username *"
                className="custom-label"
                required={false}
                rules={[
                  { required: true, message: "username is required!" },
                  { validator: validateUsername },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="username"
                  onKeyDown={(e) => {
                    const key = e.key;
                    if (!/^[A-Za-z.@0-9]*$/.test(key) && key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                  size="large"
                  maxLength={100}
                  className="custom-input"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password *"
                className="custom-label"
                required={false}
                rules={[{ validator: passwordFieldValidation }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  size="large"
                  placeholder="Password"
                  maxLength={60}
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item
                name="agree"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject("You must agree to terms"),
                  },
                ]}
              >
                <Checkbox>
                  I agree to{" "}
                  <span className="text-textColorTwo">Terms & Conditions</span>{" "}
                  and <span className="text-textColorTwo">Privacy</span>
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <div className="flex justify-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="!bg-buttonColor hover:!bg-buttonColor w-full md:w-[300px] h-[45px] text-base md:text-lg rounded-full text-white font-bold"
                    loading={loading}
                  >
                    Sign Up
                  </Button>
                </div>
              </Form.Item>
            </Form>

            <div className="-mt-2 mb-2">
              <div className="flex items-center justify-center w-full">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-2 text-sm text-gray-500">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>
            </div>

            <Form className="w-full">
              <Form.Item className="m-0">
                <div className="flex justify-center">
                  <Button
                    type="primary"
                    className="google_btn flex items-center gap-2 h-[40px] px-4 text-sm"
                    onClick={googleAuth}
                  >
                    <img
                      src={assets.google}
                      alt="google icon"
                      className="w-5 h-5"
                    />
                    Continue with Google
                  </Button>
                </div>
              </Form.Item>

              <div className="mt-2">
                <Text className="block text-center text-sm text-textColorOne">
                  <Text className="block text-center text-sm md:text-base text-textColorOne">
                    Already have an account?{" "}
                    <span
                      className="text-textColorTwo cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      Sign In
                    </span>
                  </Text>
                </Text>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
