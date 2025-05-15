import React from "react";
import signin from "../../assets/images/signup.jpg";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
const { Text } = Typography;

const SignIn: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  const navigateTo = useNavigate();

  return (
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
            Welcome back! Your AI buddy is ready to chat!{" "}
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
                className="custom-input"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password *"
              className="custom-label"
              required={false}
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
                className="custom-input"
              />
            </Form.Item>
            <div className="flex justify-between items-center mb-8">
              <Form.Item name="rememberme" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Text
                className="text-textColorTwo cursor-pointer text-sm hover:underline"
                onClick={() => navigateTo("/forgot-password")}
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
                >
                  Log in
                </Button>
              </div>
            </Form.Item>

            <Text className="block text-center text-sm md:text-base text-textColorOne">
              Don’t have an account?{" "}
              <span
                className="text-textColorTwo cursor-pointer"
                onClick={() => navigateTo("/")}
              >
                Sign up
              </span>
            </Text>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
