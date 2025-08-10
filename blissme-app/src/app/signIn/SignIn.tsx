import React, { useContext, useState } from "react";
import signin from "../../assets/images/signin.png";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { userSignInService } from "../../services/UserService";
import { AuthContext } from "../context/AuthContext";
import { setLocalStorageData } from "../../helpers/Storage";
import { useNotification } from "../context/notificationContext";
import { assets } from "../../assets/assets";
import { useDispatch } from "react-redux";
import { getUserPreferences } from "../../redux/actions/userActions";
import { AppDispatch } from "../../redux/store";

const { Text } = Typography;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const { openNotification } = useNotification();

const dispatch = useDispatch<AppDispatch>(); 
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
    window.open(`http://localhost:8080/auth/google`, "_self");
  };
  return (
    <>
      <div className="flex h-screen flex-col md:flex-row">
        <div className="block md:block w-full md:w-1/2 h-72 md:h-full">
          <img
            src={signin}
            alt="Signin"
            className="w-full h-full object-cover md:object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-4 items-center justify-center w-full md:w-1/2 h-full px-4 md:py-8 bg-gradient-to-b from-[#FFFFFF] to-[#5FB57F]">
          <div className="flex flex-col items-center w-full gap-2 md:mt-6">
            <Text className="text-black text-2xl md:text-3xl font-semibold">
              Welcome Again{" "}
            </Text>
            <Text className="text-textColorOne text-sm md:text-base font-normal block text-center">
              Welcome back! Your AI buddy is ready to chat!
            </Text>
          </div>

          <div className="flex flex-col items-center w-full max-w-[400px]">
            <Form layout="vertical" className="w-full" onFinish={onFinish}>
              <Form.Item
                name="email"
                label="Email *"
                rules={[
                  {
                    required: true,
                    message: "Email is required!",
                  },
                  {
                    type: "email",
                    message: "Email is invalid!",
                  },
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
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password *"
                rules={[
                  {
                    required: true,
                    message: "Password is required!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  size="large"
                  placeholder="Password"
                  maxLength={60}
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-8">
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
                    className="!bg-buttonColor hover:!bg-buttonColor w-full md:w-[300px] h-[45px] text-base md:text-lg rounded-full text-white font-bold"
                    loading={loading}
                  >
                    Log in
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
                    Don’t have an account?{" "}
                    <span
                      className="text-textColorTwo cursor-pointer"
                      onClick={() => navigate("/")}
                    >
                      Sign up
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

export default SignIn;
