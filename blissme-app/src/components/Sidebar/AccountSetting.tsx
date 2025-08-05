import { useState} from "react";
import { Form, Input, Button, message, Divider, Modal } from "antd";

import { getLocalStoragedata } from "../../helpers/Storage";
import Title from "antd/es/typography/Title";
import axios from "axios";
import { passwordFieldValidation } from "../../helpers/PasswordValidation";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNotification } from "../../app/context/notificationContext";

interface ResetResponse {
  message: string;
}

const AccountSetting = () => {
  const [pwdForm] = Form.useForm();
  const token = getLocalStoragedata("token") || "";
  const navigate = useNavigate();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { openNotification } = useNotification();

  const handleChangePassword = async () => {
    try {
      const values = await pwdForm.validateFields();
      const { currentPassword, newPassword, confirmPassword } = values;

      if (newPassword !== confirmPassword) {
        message.error("New password and confirm password do not match");
        return;
      }

      if (!token) {
        message.error("You must be logged in to change your password.");
        return;
      }

      const res = await axios.post<ResetResponse>(
        "http://localhost:8080/authuser/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      openNotification("success", "Password Changed", res.data.message);
      pwdForm.resetFields();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      openNotification("error", "Change Failed", errorMsg);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete<ResetResponse>(
        "http://localhost:8080/authuser/delete-account",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      openNotification("success", "Account Deleted", res.data.message);
      localStorage.clear();
      navigate("/sign-in");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      openNotification("error", "Delete Failed", errorMsg);
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <Title level={4} className="!mb-6 text-gray-800">
          Change Password
        </Title>
        <Form form={pwdForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="currentPassword"
            label={
              <span className="font-medium text-gray-700">
                Current Password
              </span>
            }
            rules={[
              { required: true, message: "Please enter current password" },
              { validator: passwordFieldValidation },
            ]}
          >
            <Input.Password className="h-10" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={
              <span className="font-medium text-gray-700">New Password</span>
            }
            rules={[
              { required: true, message: "Please enter new password" },
              { validator: passwordFieldValidation },
            ]}
          >
            <Input.Password className="h-10" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={
              <span className="font-medium text-gray-700">
                Confirm New Password
              </span>
            }
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password className="h-10" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Update Password
          </Button>
        </Form>
      </div>

      <Divider className="bg-gray-300 my-8" />

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
        <Title level={4} className="!mb-4 text-gray-800">
          Delete Account
        </Title>
        <p className="text-sm text-gray-600 mb-4">
          Deleting your account will permanently erase all your data, including:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
          <li>Your profile and login credentials</li>
          <li>All saved therapy progress and reports</li>
          <li>Any personalized recommendations and history</li>
        </ul>
        <Button
          danger
          onClick={() => setIsDeleteModalVisible(true)}
          className="border-red-600 text-red-600 hover:bg-red-50"
        >
          Delete Account
        </Button>
      </div>

      <Modal
        title="Are you sure you want to delete your account?"
        visible={isDeleteModalVisible}
        onOk={handleDeleteAccount}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Yes, delete"
        okType="danger"
        cancelText="Cancel"
        centered
      >
        <div className="space-y-3">
          <p className="text-red-600 font-medium flex items-center gap-2">
            <ExclamationCircleOutlined /> This action is irreversible.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Your profile and login credentials</li>
            <li>All saved therapy progress and reports</li>
            <li>Any personalized recommendations and history</li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default AccountSetting;
