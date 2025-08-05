import React, { useState, useEffect } from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Upload,
  Modal,
  message,
  Divider,
  Avatar,
  Tooltip,
} from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  updateCharcaterService,
  updateEmailService,
  updateNicknameService,
} from "../../services/UserService";
import {
  getLocalStoragedata,
  setLocalStorageData,
} from "../../helpers/Storage";
import { useCharacterContext } from "../context/CharacterContext";
import { useNotification } from "../context/notificationContext";
import { updateUserPreferences } from "../../redux/actions/userActions";
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

interface Character {
  _id: string;
  name: string;
  imageUrl: string;
  characterId: number;
  __v: number;
}

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();
  const token = getLocalStoragedata("token") || "";
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [email, setEmail] = useState(getLocalStoragedata("user"));
  const userId = Number(getLocalStoragedata("userId"));
  const { openNotification } = useNotification();
  const inputMode = useSelector((state: RootState) => state.user.inputMode);
  const selectedCharacterId = Number(
    getLocalStoragedata("selectedCharacterId")
  );
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const url = process.env.REACT_APP_API_URL;

  const handleFileChange = (info: any) => {
    if (info.file.status === "removed") {
      setFile(null);
      setPreviewUrl(null);
    } else {
      const selectedFile = info.file;
      if (selectedFile) {
        const actualFile = selectedFile.originFileObj || selectedFile;
        setFile(actualFile);
        const tempUrl = URL.createObjectURL(actualFile);
        setPreviewUrl(tempUrl);
      }
    }
  };

  const fetchCharacters = async () => {
    const localToken = getLocalStoragedata("token");
    if (!localToken) return;

    try {
      const response = await axios.get<Character[]>(`${url}/`, {
        headers: { Authorization: `Bearer ${localToken}` },
      });
      setCharacters(response.data);
    } catch (error: any) {
      console.error("Error fetching characters:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [url]);
  const nickname = useSelector((state: RootState) => state.user.nickname);
  const selectId = useSelector(
    (state: RootState) => state.user.virtualCharacter
  );
  console.log(characters)
  const selectedCharacter = characters.find(
    (char) => char.characterId === selectId
  );
console.log(selectedCharacter)
  const [originalCharacterName, setOriginalCharacterName] = useState(
    selectedCharacter?.name
  );

  type UploadedCharacter = {
    name: string;
    imageUrl: string;
    characterId: number;
    _id: string;
    __v: number;
  };

  const uploadCharacterImage = async (
    name: string
  ): Promise<UploadedCharacter | null> => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/blissme/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = response.data as {
        message: string;
        character: UploadedCharacter;
      };
      return data.character;
    } catch (err: any) {
      console.error("Image upload failed:", err);
      message.error("Image upload failed");
      return null;
    }
  };

  const handleSave = async (values: any) => {
    const {
      nickname: newNickname,
      email: newEmail,
      name: newCharacterName,
    } = values;

    try {
      let nicknameChanged = false;
      let emailChanged = false;
      let characterUpdated = false;

      const isCharacterNameChanged = newCharacterName !== originalCharacterName;
      const isCharacterImageChanged = !!file;

      if (isCharacterNameChanged && isCharacterImageChanged) {
        setUploading(true);
        const uploadedCharacter = await uploadCharacterImage(newCharacterName);
        setUploading(false);
        if (uploadedCharacter) {
          const updateCharResponse = await updateCharcaterService(
            {
              virtualCharacter: uploadedCharacter.characterId,
            },
            token
          );

          if (updateCharResponse.message === "Virtual character updated") {
            await fetchCharacters();
            dispatch(
              updateUserPreferences(
                newNickname,
                uploadedCharacter.characterId,
                inputMode
              )
            );
            setOriginalCharacterName(newCharacterName);
            form.resetFields();
            setFile(null);
            characterUpdated = true;
          } else {
            openNotification(
              "error",
              "Character update failed",
              updateCharResponse.message
            );
          }
        }
      } else if (isCharacterNameChanged || isCharacterImageChanged) {
        openNotification(
          "warning",
          "To update the character, you must change both name and image."
        );
      }

      if (newNickname !== nickname) {
        const response = await updateNicknameService(
          { userId: userId, nickname: newNickname },
          token
        );
        if (response.message === "Nickname updated") {
          nicknameChanged = true;
          dispatch(
            updateUserPreferences(newNickname, selectedCharacterId, inputMode)
          );
        } else {
          openNotification("error", "Nickname update failed", response.message);
        }
      }

      if (newEmail !== email) {
        const response = await updateEmailService({ newEmail }, token);
        if (response.message === "Email updated successfully") {
          setLocalStorageData("user", newEmail);
          setEmail(newEmail);
          emailChanged = true;
        } else {
          openNotification("error", "Email update failed", response.message);
        }
      }

      if (nicknameChanged || emailChanged || characterUpdated) {
        openNotification("success", "Profile updated successfully");
      }
    } catch (error: any) {
      setUploading(false);
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

  useEffect(() => {
    if (selectedCharacter) {
      setOriginalCharacterName(selectedCharacter.name);
      form.setFieldsValue({
        nickname: nickname || "",
        email: email,
        name: selectedCharacter.name,
      });
    }
  }, [selectedCharacter]);

  useEffect(() => {
    const values = form.getFieldsValue();
    const isNicknameChanged = values.nickname !== nickname;
    const isEmailChanged = values.email !== email;
    const isCharacterNameChanged = values.name !== originalCharacterName;
    const isImageChanged = !!file;

    const characterChanged = isCharacterNameChanged && isImageChanged;

    setIsFormChanged(isNicknameChanged || isEmailChanged || characterChanged);
  }, [file, form, nickname, email, originalCharacterName]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
              initialValues={{
                nickname: nickname || "",
                email: email,
                name: originalCharacterName,
              }}
              /*  onValuesChange={(_, values) => {
                const isNicknameChanged = values.nickname !== nickname;
                const isEmailChanged = values.email !== email;
                const isCharacterNameChanged =
                  values.name !== originalCharacterName;
                const isImageChanged = !!file;

                const characterChanged =
                  isCharacterNameChanged && isImageChanged;

                setIsFormChanged(
                  isNicknameChanged || isEmailChanged || characterChanged
                );
              }} */
            >
              <Form.Item
                name="name"
                label={
                  <span className="flex items-center space-x-1">
                    Character Name
                    <Tooltip
                      title="If you change the character name, you need to change the image as well to enable Save.
"
                    >
                      <ExclamationCircleOutlined className="text-yellow-500 ml-3" />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter character name" },
                ]}
              >
                <Input placeholder="Enter character name" />
              </Form.Item>

              <Form.Item
                label={
                  <span className="flex items-center space-x-1">
                    Character Image
                    <Tooltip
                      title="If you change the character image, you need to change character name as well to enable Save.
"
                    >
                      <ExclamationCircleOutlined className="text-yellow-500 ml-3" />
                    </Tooltip>
                  </span>
                }
                required
              >
                <div className="flex items-center space-x-4">
                  <Avatar
                    size={64}
                    src={previewUrl || selectedCharacter?.imageUrl}
                    shape="circle"
                  />
                  <Upload
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                    fileList={file ? [{ uid: "-1", name: file.name }] : []}
                    maxCount={1}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>
                      Change Virual Character
                    </Button>
                  </Upload>
                </div>
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

              <Button
                type="primary"
                htmlType="submit"
                className="mt-2"
                loading={uploading}
                disabled={!isFormChanged}
              >
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
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter new password" },
                  { validator: passwordFieldValidation },
                ]}
              >
                <Input.Password />
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
                <Input.Password />
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
                Update Password
              </Button>
            </Form>
          </div>

          <Divider className="bg-black mt-4" />

          <div className="mt-4">
            <Title level={4} className="!mb-4">
              Delete Account
            </Title>
            <p className="text-sm text-black mb-2 max-w-xl">
              Deleting your account will permanently erase all your data...
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
            <ExclamationCircleOutlined /> This action is irreversible.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>Your profile and login credentials</li>
            <li>All saved therapy progress and reports</li>
            <li>Any personalized recommendations and history</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
