import React, { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Typography, Alert, message } from "antd";
import signin from "../../assets/images/signin.png";
import { LockOutlined } from "@ant-design/icons";
import { useNotification } from "../context/notificationContext";
import { passwordFieldValidation } from "../../helpers/PasswordValidation";
import MessageBubble from "../../components/Background/MessageBubble";
import bg from "../../assets/images/fpw.png";

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
    <div
      className="relative z-0 min-h-screen w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="min-h-screen w-full flex items-center justify-center  relative z-10">
        <div className="flex flex-col items-center gap-2 w-full md:w-1/2 max-w-[500px] py-8 bg-white rounded-xl shadow-lg">
          {/* Message Bubble on top */}
          <MessageBubble />

          {/* Form & other content below */}
          <div className="flex flex-col items-center w-full ">
            <div className="flex flex-col items-center w-full gap-1 mb-2">
              <Text
                className="text-black text-2xl md:text-3xl font-semibold "
                style={{ fontFamily: "Merienda, cursive" }}
              >
                Reset Your Password
              </Text>

            </div>
          </div>

          <div className="flex flex-col items-center w *:-full ">
            <Form
              layout="vertical"
              className="w-[380px] sm:w-[400px]"
              onSubmitCapture={handleReset}
              form={form}
            >

              <Form.Item
                name="password"
                label="New Password   "
                className="custom-label"
                rules={[{ validator: passwordFieldValidation, required: true }]}
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
                    className="w-full md:w-[300px] h-[45px] text-base md:text-lg rounded-full text-white font-bold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
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
    </div>

    //         <Form.Item>
    //           <div className="flex justify-center">
    //             <Button
    //               type="primary"
    //               htmlType="submit"
    //               disabled={isButtonDisabled}
    //               className={`w-full md:w-[250px] h-[40px] text-base md:text-md rounded-full font-bold text-white ${
    //                 isButtonDisabled
    //                   ? "bg-gray-400 cursor-not-allowed"
    //                   : "!bg-buttonColor hover:!bg-buttonColor"
    //               }`}
    //               loading={isLoading}

  );
};

export default ResetPassword;
