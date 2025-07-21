import React, { useState, useEffect } from "react";
import axios from "axios";
import signin from "../../assets/images/signin.png";
import { Button, Form, Input, Typography, message } from "antd";
import { MailOutlined } from "@ant-design/icons";

const { Text } = Typography;

const SendEmail: React.FC = () => {
  const [form] = Form.useForm();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post<{ message: string }>(
        "http://localhost:8080/authuser/forgot-password",
        { email: values.email }
      );

      message.success(response.data.message, 5);
      setIsSubmitted(true);
      setIsButtonDisabled(true);
      form.resetFields();
    } catch (err: any) {
      console.error("Full error:", err);
      const errorMsg = err.response?.data?.message || "Something went wrong";
      message.error(String(errorMsg), 5);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = () => {
    const email = form.getFieldValue("email");
    const emailValid = form.getFieldError("email").length === 0;

    if (email && emailValid && !isSubmitted) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  useEffect(() => {
    handleFormChange();
  }, []);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="block md:block w-full md:w-1/2 h-72 md:h-full">
        <img
          src={signin}
          alt="Signin"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="flex flex-col gap-4 items-center justify-center w-full md:w-1/2 h-full px-4 md:py-8 bg-gradient-to-b from-[#FFFFFF] to-[#5FB57F]">
        <div className="flex flex-col items-center w-full gap-2 md:mt-6">
          <Text className="text-black text-2xl md:text-3xl font-semibold">
            Forgot Your Password
          </Text>
          <Text className="text-textColorOne text-sm md:text-base font-normal block text-center">
            Enter your email and we’ll send you a link to reset your password.
          </Text>
        </div>

        <div className="flex flex-col items-center w-full max-w-[400px]">
          <Form
            form={form}
            layout="vertical"
            className="w-full"
            onFinish={handleSubmit}
            onFieldsChange={handleFormChange}
          >
            <Form.Item
              name="email"
              label="Enter Your Email *"
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
                placeholder="Enter your email"
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

            <Form.Item>
              <div className="flex justify-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isButtonDisabled}
                  className={`w-full md:w-[250px] h-[40px] text-base md:text-md rounded-full font-bold text-white ${
                    isButtonDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "!bg-buttonColor hover:!bg-buttonColor"
                  }`}
                  loading={isLoading}
                >
                  Send Reset Link
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
