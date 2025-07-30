import React, { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Typography, Alert, message } from "antd";
import signin from "../../assets/images/signin.png";
import { LockOutlined } from "@ant-design/icons";
import { useNotification } from "../context/notificationContext";
import { passwordFieldValidation } from "../../helpers/PasswordValidation";

const { Text } = Typography;

interface ResetResponse {
  message: string;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [form] = Form.useForm();
  const { openNotification } = useNotification();

  useEffect(() => {
    setIsButtonDisabled(newPassword.trim().length === 0);
  }, [newPassword]);

  const handleReset = async (e: FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const res = await axios.post<ResetResponse>(
        "http://localhost:8080/authuser/reset-password",
        {
          token,
          newPassword,
        }
      );
      openNotification("success", "Reset successful", res.data.message);
      message.success(res.data.message, 5);
      setNewPassword("");
      setIsButtonDisabled(true);
      form.resetFields();
    } catch (err: any) {
      console.error("Full error:", err);
      const errorMsg = err.response?.data?.message || "Something went wrong";
       openNotification(
        "error",
        "Unable to reset your password",
        errorMsg || "Something went wrong. Please try again."
      );
      message.error(String(errorMsg), 5);
    } finally {
      setIsLoading(false);
    }
  };

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
            Reset Your Password
          </Text>
        </div>

        <div className="flex flex-col items-center w-full max-w-[400px]">
          <Form
            layout="vertical"
            className="w-full"
            onSubmitCapture={handleReset}
            form={form}
          >
            <Form.Item
              name="password"
              label="New Password *"
              className="custom-label"
              rules={[{ validator: passwordFieldValidation }]}
             
            >
              <Input.Password
                prefix={<LockOutlined />}
                size="large"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                maxLength={60}
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
                  Reset Password
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
