import { Button, Divider, Input, Typography, Spin } from "antd";
import { assets } from "../../assets/assets";
import { useState, useEffect } from "react";
import { getCurrentTime } from "../../helpers/Time";
import { chatBotService } from "../../services/ChatBotService";
import { createNewSession, fetchChatHistory, saveMessage } from "../../services/ChatMessageService";
const { Text } = Typography;

const ChatBox = () => {
  const [sessionID, setSessionID] = useState<string>("");
  const [messages, setMessages] = useState([
    { sender: "popo", text: "Hi there. How are you feeling today?", time: getCurrentTime() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await createNewSession();
      setSessionID(session);

      const history = await fetchChatHistory(session);
     const formattedHistory = Array.isArray(history)
        ? history.map((msg: any) => ({
            sender: msg.sender,
            text: msg.message,
            time: getCurrentTime(),
          }))
        : [];
      setMessages((prev) => [...prev, ...formattedHistory]);
    })();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      sender: "you",
      text: inputValue,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true); 
    await saveMessage(inputValue, sessionID,"user");

    //  Prepare chat context for LLM
    const context = [...messages, userMessage]
      .map((m) => `${m.sender}: ${m.text}`)
      .join("\n");

    const botReply = await chatBotService(context);
    setLoading(false); 

    const botMessage = {
      sender: "popo",
      text: botReply,
      time: getCurrentTime(),
    };
        //  Save bot reply to DB
    await saveMessage(botReply, sessionID,"bot");


    setMessages((prev) => [...prev, botMessage]);
     setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-center py-4">
        <img src={assets.profile} width={120} height={120} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === "you" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex gap-2 items-center">
              {msg.sender === "you" ? (
                <img src={assets.icon1} alt="" width={40} height={40} />
              ) : (
                <img src={assets.icon2} alt="" width={40} height={40} />
              )}

              {loading && msg.sender === "popo" && index === messages.length - 1 ? (
                <Spin size="small" />
              ) : (
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.sender === "you"
                      ? "bg-inputColorTwo text-right"
                      : "bg-inputColorOne text-left"
                  }`}
                >
                  <Text className="text-sm">{msg.text}</Text>
                </div>
              )}
            </div>
            <Text
              className={`text-xs text-gray-500 mt-1 ${
                msg.sender === "you" ? "" : "ml-10"
              }`}
            >
              {msg.time}
            </Text>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2">
            <img src={assets.icon2} alt="" width={40} height={40} />
            <Spin size="small" />
          </div>
        )}
      </div>

      <Divider className="m-0" />

      <div className="flex items-center gap-2 p-4 bg-white">
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
          className="flex-1 bg-inputColorThree rounded-full px-4 py-2 border-none shadow-none focus:ring-0 focus:border-none hover:bg-inputColorThree"
          disabled={loading}
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
          onClick={handleSend}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ChatBox;
