import React from "react";
import signup from "../../assets/images/signup.jpg";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import EmailIcon from "../../assets/svg/EmailIcon";
import PhoneIcon from "../../assets/svg/PhoneIcon";
import PasswordIcon from "../../assets/svg/PasswordIcon";
const { Text } = Typography;

const SignUp: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
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
                prefix={<EmailIcon />}
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
                prefix={<PasswordIcon />}
                size="large"
                placeholder="Password"
                maxLength={60}
                className="custom-input"
              />
            </Form.Item>
            <Form.Item
              name="contact"
              label="Emergency Contact Number *"
              required={false}
              rules={[
                {
                  required: true,
                  message: "Emergency contact number is required!",
                },
                { min: 10, message: "Invalid phone number!" },
              ]}
              className="custom-label"
            >
              <Input
                prefix={<PhoneIcon />}
                placeholder="Contact Number"
                size="large"
                required={false}
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
                >
                  Sign Up
                </Button>
              </div>
            </Form.Item>

            <Text className="block text-center text-sm md:text-base text-textColorOne">
              Already have an account?{" "}
              <span className="text-textColorTwo">Sign In</span>
            </Text>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
