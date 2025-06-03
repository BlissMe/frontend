import { Button, Divider, Input, Typography } from "antd";
import { assets } from "../../assets/assets";
import { useState } from "react";
import { getCurrentTime } from "../../helpers/Time";
import {chatBotService} from "../../services/ChatBotService"
const { Text } = Typography;

const ChatBox = () => {
  
  const [messages, setMessages] = useState([
    { sender: "popo", text: "Hi Popo! How are you?", time: getCurrentTime() },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      sender: "you",
      text: inputValue,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    const botReply = await chatBotService(inputValue);

    const botMessage = {
      sender: "popo",
      text: botReply,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <img src={assets.profile} width={120} height={120} />
      </div>
      <div className="p-4">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.sender === "you" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex">
                {msg.sender === "you" ? (
                  <img src={assets.icon1} alt="" width={40} height={80} />
                ) : (
                  <img src={assets.icon2} alt="" width={40} height={80} />
                )}
                <div
                  className={`p-3 rounded-lg ${
                    msg.sender === "you"
                      ? "bg-inputColorTwo text-right"
                      : "bg-inputColorOne text-left"
                  }`}
                >
                  <Text className="text-sm">{msg.text}</Text>
                </div>
              </div>
              <Text
                className={`text-xs text-gray-500 mt-1 ${
                  msg.sender === "you" ? "" : "mx-10"
                }`}
              >
                {msg.time}
              </Text>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className="flex justify-center items-center">
        <Input
          placeholder="Type your message here..."
          size="large"
          suffix={
            <img
              src={assets.mic_icon}
              alt="mic"
              className="w-5 h-5 object-contain"
            />
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSend}
          className="flex items-center bg-inputColorThree rounded-full px-4 py-2 w-full max-w-5xl placeholder-gray-500 border-none shadow-none focus:ring-0 focus:border-none hover:bg-inputColorThree"
        />
        <Button
          type="text"
          icon={
            <img
              src={assets.send_icon}
              alt="send"
              className="w-8 h-8 object-contain"
            />
          }
          className="ml-2"
          onClick={handleSend}
        />
      </div>
    </>
  );
};

export default ChatBox;
