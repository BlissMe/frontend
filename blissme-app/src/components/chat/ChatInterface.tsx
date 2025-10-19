import bearnew from "../../assets/images/bearnew.png";
import { Button, Typography, Spin, Input, Divider } from "antd";
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
import {
  getClassifierResult,
  ClassifierResult,
  getDepressionLevel,
} from "../../services/DetectionService";
import { saveClassifierToServer } from "../../services/ClassifierResults";
import { Modal, Tag, Progress, Descriptions } from "antd";
import { therapyAgentChat, User } from "../../services/TherapyAgentService";
import { getLocalStoragedata } from "../../helpers/Storage";
import { useNavigate } from "react-router-dom";

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
  const { sessionID, setSessionID, setMessages, setChatHistory, messages } =
    useContext(AuthContext);

  const [sessionSummaries, setSessionSummaries] = useState<string[]>([]);
  const [classifier, setClassifier] = useState<ClassifierResult | null>(null);
  const [detecting, setDetecting] = useState(false);
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
  const [levelResult, setLevelResult] = useState<any>(null);
  const [levelOpen, setLevelOpen] = useState(false);
  const [therapyMode, setTherapyMode] = useState(false);
  const navigate = useNavigate();
  console.log("therapyMode", therapyMode);

  useEffect(() => {
    (async () => {
      const session = await createNewSession();
      setSessionID(session);

      const allSummaries = await fetchAllSummaries();
      setSessionSummaries(allSummaries);
    })();
  }, []);

  useEffect(() => {
    const initTherapyMode = async () => {
      const user: User | null = getLocalStoragedata("user") as User | null;
      if (!user?.id) return;

      try {
        const resp = await getDepressionLevel();
        console.log("Depression Level API response:", resp);
        if (resp?.success && resp.data) {
          setLevelResult(resp.data);
          setLevelOpen(true);

          // Enable therapy mode if user has a level
          if (resp.data.level) setTherapyMode(true);
        } else {
          setLevelResult(null);
          setTherapyMode(false);
        }
      } catch (err) {
        console.error("Failed to fetch depression level:", err);
        setLevelResult(null);
        setTherapyMode(false);
      }
    };

    initTherapyMode();
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

    await saveMessage(inputValue, sessionID, "user");

    let botReply;

    // Therapy Mode
    if (therapyMode && levelResult) {
      // Get user ID from local storage (or your auth context)

      const user: User | null = getLocalStoragedata("user") as User | null;
      const userID = user?.id || "guest";

      botReply = await therapyAgentChat(
        inputValue,
        levelResult.level,
        userID, // pass correct user ID
        String(sessionID)
      );

      if (botReply.action === "START_THERAPY") {
        navigate(`/therapy/${botReply.therapy_id}`);
        setLoading(false);
        return;
      }
    } else {
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

      botReply = await chatBotService(
        context,
        inputValue,
        sessionSummaries,
        askedPhq9Ids
      );
      console.log("botReply:", botReply);
    }

    const finalBotMsg = {
      sender: "popo",
      text: botReply.response,
      time: getCurrentTime(),
    };

    await saveMessage(finalBotMsg.text, sessionID, "bot");
    setMessages((prev) => [...prev, finalBotMsg]);
    setChatHistory((prev) => [...prev, finalBotMsg]);
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

  async function ClassifierResult() {
    if (!sessionID) return; // session not ready yet
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
      if (!historyStr) return; // nothing to classify yet

      const latestSummary: string | null =
        sessionSummaries && sessionSummaries.length
          ? sessionSummaries[sessionSummaries.length - 1]
          : null;

      const res = await getClassifierResult(historyStr, sessionSummaries ?? []);
      setClassifier(res);

      try {
        await saveClassifierToServer(Number(sessionID), res);
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

      const level = resp.data?.level?.toLowerCase();
      console.log("level", level);
      if (level === "minimal" || level === "moderate") {
        setTherapyMode(true);
      } else {
        setTherapyMode(false);
      }
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
    <div className="relative flex-1 px-8 h-screen flex items-center justify-end ">
      {/* Bear Image */}
      <div className="absolute bottom-0 left-8 z-0 w-[600px] h-[600px]">
        {therapyMode === true && (
          <div className="absolute top-4 right-6 bg-green-100 text-green-700 text-sm px-3 py-1 rounded-md shadow-sm border border-green-300 z-50">
            🧘 Therapy Mode Active
          </div>
        )}
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
        {!isPhq9 && (
          <div className="flex items-center justify-between gap-2">
            <div className=" mt-2 flex justify-center">
              <Button
                type="primary"
                onClick={() => void runLevelDetection()}
                loading={detecting}
                disabled={!sessionID}
                className="bg-lime-500 hover:bg-lime-600 text-white"
              >
                Level Detection
              </Button>
            </div>
            <Modal
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
                  </div>

                  {/* R as a progress bar */}
                  <div style={{ marginBottom: 12 }}>
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
                      {/* handle either string or numeric cutoffs */}
                      {typeof levelResult.cutoffs?.minimal_max === "number"
                        ? `Minimal ≤ ${levelResult.cutoffs.minimal_max}, Moderate ≤ ${levelResult.cutoffs.moderate_max}`
                        : levelResult.cutoffs
                        ? `Minimal ${levelResult.cutoffs.Minimal}, Moderate ${levelResult.cutoffs.Moderate}, Severe ${levelResult.cutoffs.Severe}`
                        : "—"}
                    </Typography.Text>
                  </div>

                  {/* Key components */}
                  <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label="PHQ-9">
                      total: {levelResult.components?.phq9?.total ?? 0},
                      &nbsp;normalized:{" "}
                      {(levelResult.components?.phq9?.normalized ?? 0).toFixed(
                        4
                      )}
                      , &nbsp;answered:{" "}
                      {levelResult.components?.phq9?.answered_count ?? 0}/9
                    </Descriptions.Item>
                    <Descriptions.Item label="Classifier">
                      label: {levelResult.components?.classifier?.label ?? "—"},
                      &nbsp;raw:{" "}
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
                      PHQ9 {levelResult.weights?.phq9},&nbsp; Classifier{" "}
                      {levelResult.weights?.classifier},&nbsp; Emotion{" "}
                      {levelResult.weights?.emotion}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}
            </Modal>
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
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
