import { Button, Divider, Input, Typography } from "antd";
import { assets } from "../../assets/assets";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentTime } from "../../helpers/Time";
import { chatBotService } from "../../services/ChatBotService";
import { createNewSession, fetchChatHistory, saveMessage ,endCurrentSession,fetchAllSummaries} from "../../services/ChatMessageService";
import { savePHQ9Answer } from "../../services/Phq9Service";
const { Text } = Typography;

const ChatBox = () => {
  const [sessionID, setSessionID] = useState<string>("");
  const [messages, setMessages] = useState([
    { sender: "popo", text: "Hi Popo! How are you?", time: getCurrentTime() },
  ]);
const [chatHistory, setChatHistory] = useState<
  { sender: string; text: string; time: string }[]
>([]);
const [sessionSummaries, setSessionSummaries] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

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

    const botReply = await chatBotService(inputValue);

    setLoading(false); 

    const botMessage = {
      sender: "popo",
      text: botReply,
      time: getCurrentTime(),
    };

  // Track PHQ-9 if a new question is asked
if (
  typeof botReply.phq9_questionID === "number" &&
  typeof botReply.phq9_question === "string"
) {
  const questionID = botReply.phq9_questionID as number;
  const question = botReply.phq9_question as string;

  setAskedPhq9Ids((prev) => [...prev, questionID]);
  setLastPhq9({
    id: questionID,
    question: question,
  });
   setIsPhq9(true);
}

  await saveMessage(finalBotMsg.text, sessionID, "bot");

  const finalMessages = [...formattedHistory, finalBotMsg];
  setMessages(finalMessages);
  setChatHistory(finalMessages);
  setLoading(false);
};

const handlePhqAnswer = async (answer: string) => {
  const answerMessage = {
    sender: "you",
    text: answer,
    time: getCurrentTime()
  };

  setMessages((prev) => [...prev, answerMessage]);
  setIsPhq9(false); // disable chit buttons
  setLoading(true);

  // Save PHQ9 answer
  if (lastPhq9) {
    await savePHQ9Answer(
      sessionID,
      lastPhq9.id,
      lastPhq9.question,
      answer
    );
    setLastPhq9(null); // clear current PHQ9 question
  }

  await saveMessage(answer, sessionID, "user");

  const updatedHistory = await fetchChatHistory(sessionID);
  const formattedHistory = Array.isArray(updatedHistory)
    ? updatedHistory.map((msg: any) => ({
        sender: msg.sender === "bot" ? "popo" : "you",
        text: msg.message,
        time: getCurrentTime(),
      }))
    : [];

  const context = formattedHistory.map((m) => `${m.sender}: ${m.text}`).join("\n");

  const botReply = await chatBotService(
    context,
    answer,
    sessionSummaries,
    askedPhq9Ids
  );

  const finalBotMsg = {
    sender: "popo",
    text: botReply.response,
    time: getCurrentTime(),
  };

  if (
    typeof botReply.phq9_questionID === "number" &&
    typeof botReply.phq9_question === "string"
  ) {
    const questionID = botReply.phq9_questionID as number;
    const question = botReply.phq9_question as string;

    setAskedPhq9Ids((prev) => [...prev, questionID]);
    setLastPhq9({ id: questionID, question: question });
    setIsPhq9(true);
  }

  await saveMessage(finalBotMsg.text, sessionID, "bot");

  const finalMessages = [...formattedHistory, finalBotMsg];
  setMessages(finalMessages);
  setChatHistory(finalMessages);
  setLoading(false);
};

const phqOptions = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day"
];
return (
  <div className="flex flex-col h-screen">
    <div className="flex items-center justify-center py-4">
      <img src={assets.profile} width={120} height={120} />
      <Button
        type="primary"
        danger
        size="small"
        onClick={async () => {
          const res = await endCurrentSession(sessionID);
          if (res.success) {
            alert("Session ended and summary saved.");
            setIsSessionEnded(true);
            setMessages([]);
            setChatHistory([]);
            setSessionID("");
            navigate("/login");
          } else {
            alert("Failed to end session.");
          }
        }}
      >
        End Session
      </Button>
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

    {/* Input bar only if not in PHQ9 chit mode */}
    {!isPhq9 && (
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
        />
      </div>
    )}
  </div>
);
}
export default ChatBox;