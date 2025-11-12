import bearnew from "../../assets/images/bearnew.png";
import { Button, Typography, Spin } from "antd";
import { assets } from "../../assets/assets";
import { useState, useEffect, useContext, useRef } from "react";
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
import {
  getClassifierResult,
  ClassifierResult,
  getDepressionLevel,
} from "../../services/DetectionService";
import { saveClassifierToServer } from "../../services/ClassifierResults";
import { Modal, Tag, Progress, Descriptions } from "antd";
import { ConsoleSqlOutlined } from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getLocalStoragedata, setLocalStorageData } from "../../helpers/Storage";

const levelColor = (lvl?: string) => {
  switch ((lvl || "").toLowerCase()) {
    case "minimal":
      return "green";
    case "moderate":
      return "gold";
    case "severe":
      return "red";
    default:
      return "default";
  }
};

const { Text } = Typography;



const ChatInterface = () => {
  const { sessionID, setSessionID, setMessages, setChatHistory, messages, handleLogout } =
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
  const { selectedCharacter, fetchCharacters } = useCharacterContext();
  const [levelResult, setLevelResult] = useState<any>(null);
  const [levelOpen, setLevelOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [classifier, setClassifier] = useState<ClassifierResult | null>(null);
  const [isPhq9Complete, setIsPhq9Complete] = useState(false);
  const navigate = useNavigate();
const user_id = getLocalStoragedata("user_id") || "";
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // adjust to scroll height
    }
  }, [inputValue]);

  // useEffect(() => {
  //   const textarea = textareaRef.current;
  //   if (textarea) {
  //     textarea.style.height = "auto"; // reset height
  //     textarea.style.height = `${textarea.scrollHeight}px`; // set to scroll height
  //   }
  // }, [inputValue]);

  useEffect(() => {
    (async () => {
      let existingSession = getLocalStoragedata("sessionID");
      if (!existingSession) {
        const session = await createNewSession();
        existingSession = session;
        setLocalStorageData("sessionID", session);
      }

      if (existingSession) {
        setSessionID(existingSession);
      }

      const allSummaries = await fetchAllSummaries();
      setSessionSummaries(allSummaries);
    })();
  }, []);



  useEffect(() => {
    fetchCharacters();
  }, []);

  useEffect(() => {
    if (askedPhq9Ids.length >= 9 && !isPhq9Complete) {
      setIsPhq9Complete(true);
    }
  }, [askedPhq9Ids]);

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

    await saveMessage(inputValue, sessionID, "user");

    if (lastPhq9) {
      await savePHQ9Answer(
        sessionID,
        lastPhq9.id,
        lastPhq9.question,
        inputValue
      );
      setLastPhq9(null);
    }

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
      askedPhq9Ids,
      Number(user_id),
      Number(sessionID)
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
      const questionID = botReply.phq9_questionID;
      const question = botReply.phq9_question;
      setAskedPhq9Ids((prev) => [...prev, questionID]);
      setLastPhq9({ id: questionID, question });
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
    setIsPhq9(false);
    setLoading(true);

    if (lastPhq9) {
      await savePHQ9Answer(sessionID, lastPhq9.id, lastPhq9.question, answer);
      setLastPhq9(null);
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
      askedPhq9Ids,
      Number(user_id),
      Number(sessionID)
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
      const questionID = botReply.phq9_questionID;
      const question = botReply.phq9_question;
      setAskedPhq9Ids((prev) => [...prev, questionID]);
      setLastPhq9({ id: questionID, question });
      setIsPhq9(true);
    }

    await saveMessage(finalBotMsg.text, sessionID, "bot");
    const finalMessages = [...formattedHistory, finalBotMsg];
    setMessages(finalMessages);
    setChatHistory(finalMessages);
    setLoading(false);
  };

  async function ClassifierResult() {
    if (!sessionID) return;
    setDetecting(true);
    try {
      const updatedHistory = await fetchChatHistory(sessionID);
      const formattedHistory: string[] = Array.isArray(updatedHistory)
        ? updatedHistory.map(
          (msg: any) =>
            `${msg.sender === "bot" ? "popo" : "you"}: ${msg.message}`
        )
        : [];

      const historyStr = formattedHistory.join("\n").trim();
      if (!historyStr) return;

      const latestSummary: string | null =
        sessionSummaries && sessionSummaries.length
          ? sessionSummaries[sessionSummaries.length - 1]
          : null;

      const res = await getClassifierResult(historyStr, sessionSummaries ?? []);
      setClassifier(res);
      try {
        await saveClassifierToServer(Number(sessionID), res);
        console.log("Classifier result saved.");
      } catch (err) {
        console.error("Failed to persist classifier result:", err);
      }
    } catch (e) {
      console.error("getClassifierResult failed:", e);
    } finally {
      setDetecting(false);
    }
  }

  async function runLevelDetection() {
    try {
      await ClassifierResult();

      const resp = await getDepressionLevel();
      if (!resp?.success) throw new Error("level API failed");
      setLevelResult(resp.data);
      setLevelOpen(true);
      handleLogout();
    } catch (e) {
      console.error(e);
    }
  }
  const phqOptions = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day",
  ];

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-end w-full h-full p-2 md:p-4 overflow-hidden">
      {/* Bear Image - below on mobile, left on desktop */}
      {/* Bear Image (desktop) */}
      <div className="hidden md:block absolute bottom-0 left-8 z-0 w-[600px] h-[600px]">
        <img
          src={bearnew}
          alt="Bear"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Chat Box */}
      <div
        className="relative z-10 w-full md:w-3/4 lg:w-2/3 h-full 
  bg-green-100/40 rounded-xl p-4 md:p-6 shadow-lg 
  flex flex-col justify-between mx-auto md:mx-0 md:mr-10 
  mt-4 md:mt-0 backdrop-blur-md overflow-hidden"
      >

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-2 md:px-4 space-y-4 pb-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === "you" ? "items-end" : "items-start"
                }`}
            >
              <div
                className={`flex gap-2 items-center ${msg.sender === "you" ? "flex-row-reverse" : "flex-row"
                  }`}
              >
                {msg.sender === "you" ? (
                  <img
                    src={user}
                    alt="User"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                  />
                ) : (
                  <img
                    src={selectedCharacter?.imageUrl}
                    alt="bot"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  />
                )}

                <div className="relative max-w-[80%]">
                  {msg.sender === "you" ? (
                    <div className="relative px-4 py-2 md:px-5 md:py-3 bg-gradient-to-br from-red-100 to-red-300 rounded-[30px] md:rounded-[40px] shadow text-gray-800 text-sm md:text-base">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="relative px-4 py-2 md:px-5 md:py-3 bg-gradient-to-br from-green-200 to-green-400 rounded-[30px] md:rounded-[40px] shadow text-gray-800 text-sm md:text-base">
                      {msg.text}
                    </div>
                  )}
                </div>
              </div>

              <Text className="text-xs text-gray-500 mt-1 ml-10 md:ml-12">
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
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              />
              <Spin size="small" />
            </div>
          )}
        </div>

        {/* Input Field */}
        {/* Input Field (Always Visible) */}
        <div className="flex items-end justify-between gap-2 mt-3">
          <textarea
            rows={1}
            ref={textareaRef}
            className="flex-1 px-3 py-2 md:px-4 md:py-3 rounded-xl border border-gray-300 
   focus:outline-none text-sm md:text-base resize-none overflow-hidden 
   transition-all duration-150 leading-[1.5rem]"
            style={{ maxHeight: "150px" }}
            value={inputValue}
            placeholder="Type your message here..."
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading || isPhq9}
          />


          <Button
            type="text"
            icon={
              <img
                src={assets.send_icon}
                alt="send"
                className="w-6 h-6 md:w-8 md:h-8"
              />
            }
            onClick={handleSend}
            disabled={loading || isPhq9}
          />
        </div>


        {/* End Session Button + Modal (Only show when PHQ-9 complete) */}
        {isPhq9Complete && (
          <div className="mt-4 flex flex-col items-center">
            <Button
              type="primary"
              onClick={() => void runLevelDetection()}
              loading={detecting}
              disabled={!sessionID}
              className="bg-lime-500 hover:bg-lime-600 text-white"
            >
              End Session
            </Button>

            {/* <Modal
              open={levelOpen}
              onCancel={() => setLevelOpen(false)}
              onOk={() => setLevelOpen(false)}
              okText="OK"
              title="Depression Level"
              centered
              destroyOnClose
              className="z-10"
            >
              {!levelResult ? (
                <div className="flex items-center justify-center py-6">
                  <Spin />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {levelResult.level || "—"}
                    </Typography.Title>
                    <Tag color={levelColor(levelResult.level)}>
                      {levelResult.level}
                    </Tag>
                  </div> */}

            {/* R value progress bar */}
            {/* <div style={{ marginBottom: 12 }}>
                    <Typography.Text strong>
                      Composite Index (R)
                    </Typography.Text>
                    <Progress
                      percent={Math.round(
                        Number(levelResult.R_value || 0) * 100
                      )}
                      status="active"
                      strokeColor={
                        levelColor(levelResult.level) === "gold"
                          ? "#faad14"
                          : levelColor(levelResult.level) === "red"
                          ? "#ff4d4f"
                          : "#52c41a"
                      }
                      showInfo
                    />
                    <Typography.Text type="secondary">
                      R = {Number(levelResult.R_value || 0).toFixed(4)}{" "}
                      &nbsp;|&nbsp; Cutoffs:&nbsp;
                      {typeof levelResult.cutoffs?.minimal_max === "number"
                        ? `Minimal ≤ ${levelResult.cutoffs.minimal_max}, Moderate ≤ ${levelResult.cutoffs.moderate_max}`
                        : levelResult.cutoffs
                        ? `Minimal ${levelResult.cutoffs.Minimal}, Moderate ${levelResult.cutoffs.Moderate}, Severe ${levelResult.cutoffs.Severe}`
                        : "—"}
                    </Typography.Text>
                  </div> */}

            {/* Components Summary */}
            {/* <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label="PHQ-9">
                      total: {levelResult.components?.phq9?.total ?? 0}, &nbsp;
                      normalized:{" "}
                      {(levelResult.components?.phq9?.normalized ?? 0).toFixed(
                        4
                      )}
                      , &nbsp;answered:{" "}
                      {levelResult.components?.phq9?.answered_count ?? 0}/9
                    </Descriptions.Item>
                    <Descriptions.Item label="Classifier">
                      label: {levelResult.components?.classifier?.label ?? "—"},
                      &nbsp; raw:{" "}
                      {(
                        levelResult.components?.classifier?.confidence_raw ??
                        levelResult.components?.classifier?.confidence ??
                        0
                      ).toFixed(4)}
                      , &nbsp;calibrated:{" "}
                      {(
                        levelResult.components?.classifier
                          ?.confidence_calibrated ??
                        levelResult.components?.classifier?.confidence ??
                        0
                      ).toFixed(4)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Emotion">
                      {levelResult.components?.classifier?.emotion ?? "—"}{" "}
                      (binary:{" "}
                      {levelResult.components?.classifier?.emotion_binary ?? 0})
                    </Descriptions.Item>
                    <Descriptions.Item label="Weights">
                      PHQ9 {levelResult.weights?.phq9}, &nbsp; Classifier{" "}
                      {levelResult.weights?.classifier}, &nbsp; Emotion{" "}
                      {levelResult.weights?.emotion}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}
            </Modal> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;