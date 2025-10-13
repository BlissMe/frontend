import bearnew from "../../assets/images/bearnew.png";
import { Button, Typography, Spin } from "antd";
import { assets } from "../../assets/assets";
import { useState, useEffect, useContext } from "react";
import { getCurrentTime } from "../../helpers/Time";
import { chatBotService } from "../../services/ChatBotService";
import {
  createNewSession,
  fetchChatHistory,
  saveMessage,
  fetchAllSummaries,
} from "../../services/ChatMessageService";
import { savePHQ9Answer } from "../../services/Phq9Service";
import { useCharacterContext } from "../../app/context/CharacterContext";
import { AuthContext } from "../../app/context/AuthContext";
import { Message } from "../../app/context/AuthContext";
import user from "../../assets/images/user.png";

const { Text } = Typography;

const ChatInterface = () => {
  const { sessionID, setSessionID, setMessages, setChatHistory, messages } =
    useContext(AuthContext);
  const [sessionSummaries, setSessionSummaries] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPhq9, setLastPhq9] = useState<{
    id: number;
    question: string;
  } | null>(null);
  const [askedPhq9Ids, setAskedPhq9Ids] = useState<number[]>([]);
  const [isPhq9, setIsPhq9] = useState(false);
  const { selectedCharacter, nickname, fetchCharacters } =
    useCharacterContext();

  useEffect(() => {
    (async () => {
      const session = await createNewSession();
      setSessionID(session);

      const allSummaries = await fetchAllSummaries();
      setSessionSummaries(allSummaries);
    })();
  }, []);
  useEffect(() => {
    fetchCharacters();
  }, []);

  useEffect(() => {
    fetchCharacters();
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

    // Save user message to DB
    await saveMessage(inputValue, sessionID, "user");

    if (lastPhq9) {
      await savePHQ9Answer(
        sessionID,
        lastPhq9.id,
        lastPhq9.question,
        inputValue // this is the user's answer
      );
      setLastPhq9(null); // clear it after saving
    }

    // Get updated chat history
    const updatedHistory = await fetchChatHistory(sessionID);
    const formattedHistory = Array.isArray(updatedHistory)
      ? updatedHistory.map((msg: any) => ({
          sender: msg.sender === "bot" ? "popo" : "you",
          text: msg.message,
          time: getCurrentTime(),
        }))
      : [];

    const context = formattedHistory
      .map((m) => `${m.sender}: ${m.text}`)
      .join("\n");

    const botReply = await chatBotService(
      context,
      inputValue,
      sessionSummaries,
      askedPhq9Ids
    );

    const finalBotMsg = {
      sender: "popo",
      text: botReply.response,
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
      time: getCurrentTime(),
    };

    setMessages((prev: Message[]) => [...prev, answerMessage]);
    setIsPhq9(false); // disable chit buttons
    setLoading(true);

    // Save PHQ9 answer
    if (lastPhq9) {
      await savePHQ9Answer(sessionID, lastPhq9.id, lastPhq9.question, answer);
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

    const context = formattedHistory
      .map((m) => `${m.sender}: ${m.text}`)
      .join("\n");

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
    "Nearly every day",
  ];

  return (
    <div className="relative flex-1 px-8 h-screen flex items-center justify-end ">
      {/* Bear Image */}
      <div className="absolute bottom-0 left-8 z-0 w-[600px] h-[600px]">
        <img
          src={bearnew}
          alt="Bear"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Chat Box */}
      <div className="relative z-10 w-2/3 h-[90%] bg-green-100 bg-opacity-100 rounded-xl p-6 shadow-lg flex flex-col justify-between">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.sender === "you" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`flex gap-2 items-center ${
                  msg.sender === "you" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                {msg.sender === "you" ? (
                  <div className="text-2xl">
                    <img
                      src={user}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <img
                    src={selectedCharacter?.imageUrl}
                    alt="bot"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}

                {/* Message bubble */}
                <div className="relative max-w-xs">
                  {msg.sender === "you" ? (
                    <div className="relative px-5 py-3 bg-gradient-to-br from-red-100 to-red-300 rounded-[40px] shadow text-gray-800 text-sm leading-relaxed">
                      {/* Cloud tail for user (right side) */}
                      <div className="absolute -right-3 bottom-1 w-4 h-4 bg-red-200 rounded-full"></div>
                      <div className="absolute -right-1.5 bottom-3 w-3 h-3 bg-red-300 rounded-full"></div>
                      {msg.text}
                    </div>
                  ) : (
                    <div className="relative px-5 py-3 bg-gradient-to-br from-green-200 to-green-400 rounded-[40px] shadow text-gray-800 text-sm leading-relaxed">
                      {/* Cloud tail for bot (left side) */}
                      <div className="absolute -left-3 bottom-1 w-4 h-4 bg-green-300 rounded-full"></div>
                      <div className="absolute -left-1.5 bottom-3 w-3 h-3 bg-green-400 rounded-full"></div>
                      {msg.text}
                    </div>
                  )}
                </div>
              </div>

              <Text
                className={`text-xs text-gray-500 mt-1 ${
                  msg.sender === "you" ? "" : "ml-12"
                }`}
              >
                {msg.time}
              </Text>

              {isPhq9 &&
                lastPhq9 &&
                msg.sender === "popo" &&
                index === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-10">
                    {phqOptions.map((option) => (
                      <Button
                        key={option}
                        size="small"
                        onClick={() => handlePhqAnswer(option)}
                        className="bg-blue-100 hover:bg-blue-200 border-blue-300"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-2">
              <img
                src={selectedCharacter?.imageUrl}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <Spin size="small" />
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="flex items-center justify-between gap-2">
          {/* Input + Button Row */}
          <div className="flex items-center w-full gap-2">
            {/* Input */}
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              disabled={loading}
            />

            {/* Optional Divider */}
            {/* <Divider type="vertical" className="h-8 bg-gray-200" /> */}

            {/* Send Button */}
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
      </div>
    </div>
  );
};

export default ChatInterface;
