import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Avatar, Tooltip } from "antd";
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
import { updateUserPreferences } from "../../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import axios from "axios";
import { useNotification } from "../../app/context/notificationContext";
import { useCharacterContext } from "../../app/context/CharacterContext";

const ProfileSetting = () => {
  const { nickname, selectId, characters, fetchCharacters } =
    useCharacterContext();
  const [form] = Form.useForm();
  const token = getLocalStoragedata("token") || "";
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState(getLocalStoragedata("user"));
  const userId = Number(getLocalStoragedata("userId"));
  const { openNotification } = useNotification();
  const inputMode = useSelector((state: RootState) => state.user.inputMode);
  const selectedCharacterId = Number(
    getLocalStoragedata("selectedCharacterId")
  );
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFormChanged, setIsFormChanged] = useState(false);

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

  const selectedCharacter = characters.find(
    (char) => char.characterId === selectId
  );

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
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-32">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Profile Settings
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          nickname: nickname || "",
          email: email,
          name: originalCharacterName,
        }}
        onValuesChange={(_, values) => {
          const isNicknameChanged = values.nickname !== nickname;
          const isEmailChanged = values.email !== email;
          const isCharacterNameChanged = values.name !== originalCharacterName;
          const isImageChanged = !!file;

          const characterChanged = isCharacterNameChanged && isImageChanged;

          setIsFormChanged(
            isNicknameChanged || isEmailChanged || characterChanged
          );
        }}
      >
        <Form.Item
          name="name"
          label={
            <span className="flex items-center space-x-2 font-medium text-gray-700">
              Character Name
              <Tooltip title="If you change the character name, you need to change the image as well to enable Save.">
                <ExclamationCircleOutlined className="text-yellow-500 ml-3" />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: "Please enter character name" }]}
        >
          <Input placeholder="Enter character name" className="h-10" />
        </Form.Item>

        <Form.Item
          label={
            <span className="flex items-center space-x-2 font-medium text-gray-700">
              Character Image
              <Tooltip title="If you change the character image, you need to change character name as well to enable Save.">
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
              <Button
                icon={<UploadOutlined />}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Change Virtual Character
              </Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item
          name="nickname"
          label={<span className="font-medium text-gray-700">Nick Name</span>}
          rules={[{ required: true, message: "Please enter your nickname" }]}
        >
          <Input className="h-10" />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span className="font-medium text-gray-700">Email</span>}
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input className="h-10" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
          loading={uploading}
          disabled={!isFormChanged}
        >
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default ProfileSetting;
