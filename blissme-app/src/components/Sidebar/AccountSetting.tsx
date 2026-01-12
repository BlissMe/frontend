import { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Modal,
  Tabs,
  Checkbox,
  Divider,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { getLocalStoragedata } from "../../helpers/Storage";
import { passwordFieldValidation } from "../../helpers/PasswordValidation";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../app/context/notificationContext";

interface ResetResponse {
  message: string;
}

const { TabPane } = Tabs;

const AccountSetting = () => {
  const [pwdForm] = Form.useForm();
  const token = getLocalStoragedata("token") || "";
  const navigate = useNavigate();
  const { openNotification } = useNotification();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [confirmDeleteChecked, setConfirmDeleteChecked] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

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

      const res = await fetch(`${API_URL}/authuser/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data: ResetResponse = await res.json();

      openNotification("success", "Password Changed", data.message);
      pwdForm.resetFields();
    } catch (err: any) {
      openNotification(
        "error",
        "Change Failed",
        err.message || "Something went wrong"
      );
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${API_URL}/authuser/delete-account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data: ResetResponse = await res.json();

      openNotification("success", "Account Deleted", data.message);
      localStorage.clear();
      navigate("/sign-in");
    } catch (err: any) {
      openNotification(
        "error",
        "Delete Failed",
        err.message || "Something went wrong"
      );
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto bg-green-300/50 p-6 rounded-xl shadow-md mt-32">
        <div className="w-full flex justify-center mt-4">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-6" style={{ fontFamily: 'Merienda, cursive' }}>
            Account Settings
          </h2>
        </div>
        <Tabs activeKey={activeTabKey} onChange={handleTabChange} centered>
          <TabPane tab="Change Password" key="1">
            <Form
              form={pwdForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
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
                <Input.Password className="h-10 rounded-lg bg-emerald-100 " />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label={
                  <span className="font-medium text-gray-700">
                    New Password
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter new password" },
                  { validator: passwordFieldValidation },
                ]}
              >
                <Input.Password className="h-10 rounded-lg bg-emerald-100" />
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
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password className="h-10 rounded-lg bg-emerald-100" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="mt-2 bg-emerald-600 hover:bg-emerald-400 text-white font-semibold py-2 rounded-md"
              >
                Update Password
              </Button>
            </Form>
          </TabPane>

          <TabPane tab="Delete Account" key="2">
            <p className="text-sm text-gray-600 mb-4">
              Deleting your account will <strong>permanently erase</strong> all
              your data, including:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
              <li>Your profile and login credentials</li>
              <li>All saved therapy progress and reports</li>
              <li>Any personalized recommendations and history</li>
            </ul>

            <Divider />

            <p className="text-sm text-gray-600 mb-4">
              If you are sure you want to proceed, please confirm by checking
              the box below:
            </p>

            <Checkbox
              checked={confirmDeleteChecked}
              onChange={(e) => setConfirmDeleteChecked(e.target.checked)}
            >
              I understand that deleting my account is{" "}
              <strong>irreversible</strong> and I want to proceed.
            </Checkbox>

            <Button
              danger
              disabled={!confirmDeleteChecked}
              onClick={() => setIsDeleteModalVisible(true)}
              className="border-red-600 text-red-600 hover:bg-red-50 mt-4"
            >
              Delete Account
            </Button>
          </TabPane>
        </Tabs>
      </div>

      <Modal
        title={
          <div className="text-center text-xl font-semibold text-gray-800">
            💔 Are you sure you want to delete account?
          </div>
        }
        open={isDeleteModalVisible}
        onOk={handleDeleteAccount}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Yes, delete my account"
        okType="danger"
        cancelText="Keep my account"
        centered
      >
        <div className="space-y-5 text-center px-2">
          <p className="text-red-600 font-medium flex justify-center items-center gap-2 text-sm">
            <ExclamationCircleOutlined className="text-lg" />
            This action is <strong>permanent</strong> and cannot be undone.
          </p>

          <p className="text-gray-700 text-base">
            We’re truly <span className="font-semibold">sad to see you go</span>
            . Your presence meant a lot to us.
          </p>

          <p className="text-gray-600 text-sm">
            If something didn’t meet your expectations, we’d love to hear your
            feedback.
            <br />
            Every voice matters in helping us grow 💬
          </p>

          <p className="text-gray-500 text-xs italic">
            Thank you for being with us. We hope our paths cross again someday.
            🌟
          </p>
        </div>
      </Modal>
    </>
  );
};

export default AccountSetting;
