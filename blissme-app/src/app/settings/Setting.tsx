import React, { useState, useEffect } from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Avatar,
  Upload,
  Modal,
  message,
  Divider,
} from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  updateEmailService,
  updateNicknameService,
} from "../../services/UserService";
import {
  getLocalStoragedata,
  setLocalStorageData,
} from "../../helpers/Storage";
import { useCharacterContext } from "../context/CharacterContext";
import { useNotification } from "../context/notificationContext";
import {
  setUserPreferences,
  updateUserPreferences,
} from "../../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Title from "antd/es/typography/Title";
import axios from "axios";
import { passwordFieldValidation } from "../../helpers/PasswordValidation";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

interface ResetResponse {
  message: string;
}

const Settings: React.FC = () => {
  const { nickname } = useCharacterContext();
  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();
  const token = getLocalStoragedata("token") || "";
  const dispatch = useDispatch<AppDispatch>();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [changePwdVisible, setChangePwdVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [notifications, setNotifications] = useState({
    general: true,
    therapyReminders: false,
    progressReports: true,
  });

  const [email, setEmail] = useState(getLocalStoragedata("user"));
  const userId = Number(getLocalStoragedata("userId"));
  const { openNotification } = useNotification();
  const inputMode = useSelector((state: RootState) => state.user.inputMode);
  const [selectedCharacterId, setSelectedCharacterId] = useState(
    Number(getLocalStoragedata("selectedCharacterId"))
  );
  const navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue({
      nickname: nickname || "",
      email: email,
    });
  }, [nickname, email, form]);

  const handleSave = async (values: any) => {
    const { nickname: newNickname, email: newEmail } = values;

    try {
      let nicknameChanged = false;
      let emailChanged = false;

      if (newNickname !== nickname) {
        const response = await updateNicknameService(
          {
            userId: userId,
            nickname: newNickname,
          },
          token
        );
        if (response.message === "Nickname updated") {
          nicknameChanged = true;
          dispatch(
            updateUserPreferences(newNickname, selectedCharacterId, inputMode)
          );
        } else {
          openNotification(
            "error",
            "Nickname update failed",
            response.message || "Nickname update failed. Please try again later"
          );
        }
      }

      if (newEmail !== email) {
        const response = await updateEmailService({ newEmail }, token);
        if (response.message === "Email updated successfully") {
          setLocalStorageData("user", newEmail);
          setEmail(newEmail);
          emailChanged = true;
        } else {
          openNotification(
            "error",
            "Email update failed",
            response.message || "Email update failed. Please try again later"
          );
        }
      }

      if (nicknameChanged && emailChanged) {
        openNotification("success", "Profile updated successfully");
      } else if (nicknameChanged) {
        openNotification("success", "Nickname updated successfully");
      } else if (emailChanged) {
        openNotification("success", "Email updated successfully");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile";
      openNotification("error", "Profile Update Failed", errorMessage);
    }
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

      const res = await axios.post<ResetResponse>(
        "http://localhost:8080/authuser/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      openNotification("success", "Password Changed", res.data.message);
      setChangePwdVisible(false);
      pwdForm.resetFields();
    } catch (err: any) {
      console.error("Full error:", err);
      const errorMsg = err.response?.data?.message || "Something went wrong";
      openNotification("error", "Change Failed", errorMsg);
      message.error(errorMsg, 5);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete<ResetResponse>(
        "http://localhost:8080/authuser/delete-account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      openNotification("success", "Account Deleted", res.data.message);
      message.success("Account deleted successfully");
      localStorage.clear();
      navigate("/sign-in");
    } catch (err: any) {
      console.error("Delete account error:", err);
      const errorMsg = err.response?.data?.message || "Something went wrong";
      openNotification("error", "Delete Failed", errorMsg);
      message.error(errorMsg, 5);
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Profile" key="1">
          <div className="max-w-md">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{ nickname: nickname || "", email: email }}
            >
              <Form.Item label="Avatar">
                <Upload showUploadList={false} beforeUpload={() => false}>
                  <Avatar size={64} src="https://i.pravatar.cc/150?img=4" />
                  <Button className="ml-4" icon={<UploadOutlined />}>
                    Upload
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="nickname"
                label="Nick Name"
                rules={[
                  { required: true, message: "Please enter your nickname" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input />
              </Form.Item>

              <Button type="primary" htmlType="submit" className="mt-2">
                Save Changes
              </Button>
            </Form>
          </div>
        </TabPane>

        <TabPane tab="Security" key="2">
          <div className="max-w-md">
            <Title level={4} className="!mb-4">
              Change Password
            </Title>

            <Form
              form={pwdForm}
              layout="vertical"
              name="change_password_form"
              onFinish={handleChangePassword}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[
                  { required: true, message: "Please enter current password" },
                  { validator: passwordFieldValidation },
                ]}
              >
                <Input.Password className="!rounded-md" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter new password" },
                  { validator: passwordFieldValidation },
                ]}
              >
                <Input.Password className="!rounded-md" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
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
                <Input.Password className="!rounded-md" />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button type="primary" htmlType="submit" className="!w-full">
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Divider className="bg-black mt-4" />

          <div className="mt-4">
            <Title level={4} className="!mb-4">
              Delete Account
            </Title>

            <p className="text-sm text-black mb-2 max-w-xl">
              Deleting your account will permanently erase all your data from
              our system. This includes your login information, therapy
              progress, saved reports, and any preferences or settings you've
              configured.
            </p>

            <p className="text-sm text-black mb-4 max-w-xl">
              If you're experiencing issues, please contact our support team
              first. We may be able to help without account deletion.
            </p>

            <Button danger onClick={() => setIsDeleteModalVisible(true)}>
              Delete Account
            </Button>
          </div>
        </TabPane>
      </Tabs>

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
          <p className="text-red-600 font-medium">
            ⚠️ This action is irreversible. Once you delete your account, all
            associated data will be permanently removed.
          </p>

          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Your profile and login credentials</li>
            <li>All saved therapy progress and reports</li>
            <li>Any personalized recommendations and history</li>
          </ul>

          <p className="text-sm text-gray-600 mt-2">
            If you’re sure, click “Yes, delete” to permanently remove your
            account.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
