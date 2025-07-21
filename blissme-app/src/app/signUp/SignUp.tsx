import React, { useContext, useState} from "react";
import { useNavigate} from "react-router-dom";
import signup from "../../assets/images/signup.jpg";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { assets } from "../../assets/assets";
import { userSignUpService } from "../../services/UserService";
import { passwordFieldValidation } from "../../helpers/PasswordValidation";
import { AuthContext } from "../context/AuthContext";
import { setLocalStorageData } from "../../helpers/Storage";

const { Text } = Typography;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const userData = {
        email: values.email,
        password: values.password,
        authType: "normal",
      };

      const response = await userSignUpService(userData);
      
      if (response.message) {
        message.success("Successfully Registered!");
        setToken(response?.token);
        setLocalStorageData("token", response?.token);
        navigate("/nick-name", { replace: true });
      } else {
        message.error(response.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      message.error("Something went wrong. Please try again later.");
      console.error(error);
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
                name="email"
                label="Email *"
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
            <Form>
              <div className="flex justify-center my-4">
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
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </span>
              </Text>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
