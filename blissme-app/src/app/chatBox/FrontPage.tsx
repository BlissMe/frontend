import { useState, useEffect } from "react";
import { Input, Select, Button, Card, Avatar, Form } from "antd";
import { profileDetailsService } from "../../services/ChatBotService";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const characters = [
  { name: "SkyFox", image: "/avatars/fox.png" },
  { name: "BlueBear", image: "/avatars/bear.png" },
  { name: "WiseOwl", image: "/avatars/owl.png" },
];

export default function VirtualLogin() {
  const [virtualName, setVirtualName] = useState<string>("");
  const [character, setCharacter] = useState<string>(characters[0].name);
  const [inputMethod, setInputMethod] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    setDisabled(!(virtualName.trim() && character && inputMethod));
  }, [virtualName, character, inputMethod]);

  const handleSubmit = async () => {
    if (!virtualName.trim()) {
      alert("Please enter a virtual name.");
      return;
    }
    setLoading(true);
    try {
      await profileDetailsService(virtualName, character, inputMethod);
      if (inputMethod === "text") {
        navigate("/chat/text");
      } else {
        navigate("/chat/voice");
      }
    } catch (error) {
      console.error("Error submitting virtual login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome to Blissme-app
        </h1>

        <Form className="mb-4" onFinish={handleSubmit}>
          <label htmlFor="virtualName" className="block mb-1 font-semibold">
            Your Virtual Name
          </label>
          <Input
            id="virtualName"
            value={virtualName}
            onChange={(e) => setVirtualName(e.target.value)}
            placeholder="Enter a name you'd like to use"
            disabled={loading}
          />

          <div className="mb-4">
            <label className="block mb-1 font-semibold">
              Select Your Character
            </label>
            <div className="flex space-x-4 mt-2">
              {characters.map((char) => (
                <div
                  key={char.name}
                  className={`cursor-pointer border rounded-xl p-2 flex flex-col items-center w-24 hover:shadow-md transition-all duration-200 ${
                    character === char.name
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => !loading && setCharacter(char.name)}
                >
                  <Avatar src={char.image} size={48} className="mb-1" />
                  <span className="text-sm font-medium">{char.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">
              Choose Input Method
            </label>
            <Select
              value={inputMethod}
              onChange={(value) => setInputMethod(value)}
              className="w-full"
              disabled={loading}
            >
              <Option value="text">Text</Option>
              <Option value="voice">Voice</Option>
            </Select>
          </div>

          <Button
            type="primary"
            block
            loading={loading}
            disabled={disabled}
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </Form>
      </Card>
    </div>
  );
}
