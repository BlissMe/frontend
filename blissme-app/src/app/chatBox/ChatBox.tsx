import { Button, Divider, Input, Typography, Spin } from "antd";
import { assets } from "../../assets/assets";
import { useState, useEffect, useContext, use } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentTime } from "../../helpers/Time";
import { chatBotService } from "../../services/ChatBotService";
import {
  createNewSession,
  fetchChatHistory,
  saveMessage,
  fetchAllSummaries,
} from "../../services/ChatMessageService";
import { getClassifierResult ,ClassifierResult,getDepressionLevel  } from "../../services/DetectionService";
import {saveClassifierToServer  } from "../../services/ClassifierResults";
import { savePHQ9Answer } from "../../services/Phq9Service";
import Avatar from "../../components/profile/Avatar";
import { useCharacterContext } from "../context/CharacterContext";
import { AuthContext } from "../context/AuthContext";
import { Message } from "../context/AuthContext";
import Nickname from "../start/Nickname";
import { Modal, Tag, Progress, Descriptions } from "antd";
import { getLocalStoragedata } from "../../helpers/Storage";

const { Text } = Typography;
const levelColor = (lvl?: string) => {
  switch ((lvl || "").toLowerCase()) {
    case "minimal":  return "green";
    case "moderate": return "gold";
    case "severe":   return "red";
    default:         return "default";
  }
};


const ChatBox = () => {
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
  const { selectedCharacter,nickname ,fetchCharacters } = useCharacterContext();
  console.log(selectedCharacter)
  const [levelResult, setLevelResult] = useState<any>(null);
  const [levelOpen, setLevelOpen] = useState(false);
  const user_id = getLocalStoragedata("userId") || "";
  useEffect(() => {
    (async () => {
      const session = await createNewSession();
      setSessionID(session);

      const allSummaries = await fetchAllSummaries();
      setSessionSummaries(allSummaries);
    })();
  }, []);
  console.log("sessionSummaries:", sessionSummaries);
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
      askedPhq9Ids,
      Number(user_id),
      Number(sessionID)
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
      ? updatedHistory.map((msg: any) =>
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
    
    console.log("Classifier:", res);
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
    // 1) run your existing LLM classifier and persist it
    await ClassifierResult();

    // 2) compute composite index by userID (backend uses token->userID)
    const resp = await getDepressionLevel();
    if (!resp?.success) throw new Error("level API failed");
    console.log("Depression Level Response:", resp);
    setLevelResult(resp.data);
setLevelOpen(true); // open modal to show results
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
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-center py-4">
        <img
          src={selectedCharacter?.imageUrl}
          alt="bot"
          width={120}
          height={120}
        />
      </div>
      <div className="px-4 -mt-2 mb-2 flex justify-center">
        <Button
          type="primary"
          onClick={() => void runLevelDetection()} 
          loading={detecting}
          disabled={!sessionID}
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
        <Tag color={levelColor(levelResult.level)}>{levelResult.level}</Tag>
      </div>

      {/* R as a progress bar */}
      <div style={{ marginBottom: 12 }}>
        <Typography.Text strong>Composite Index (R)</Typography.Text>
        <Progress
          percent={Math.round((Number(levelResult.R_value || 0)) * 100)}
          status="active"
          strokeColor={
            levelColor(levelResult.level) === "gold" ? "#faad14"
            : levelColor(levelResult.level) === "red" ? "#ff4d4f"
            : "#52c41a"
          }
          showInfo
        />
        <Typography.Text type="secondary">
          R = {Number(levelResult.R_value || 0).toFixed(4)} &nbsp;|&nbsp;
          Cutoffs:&nbsp;
          {/* handle either string or numeric cutoffs */}
          {typeof levelResult.cutoffs?.minimal_max === "number"
            ? `Minimal ≤ ${levelResult.cutoffs.minimal_max}, Moderate ≤ ${levelResult.cutoffs.moderate_max}`
            : (levelResult.cutoffs
                ? `Minimal ${levelResult.cutoffs.Minimal}, Moderate ${levelResult.cutoffs.Moderate}, Severe ${levelResult.cutoffs.Severe}`
                : "—")}
        </Typography.Text>
      </div>

      {/* Key components */}
      <Descriptions size="small" column={1} bordered>
        <Descriptions.Item label="PHQ-9">
          total: {levelResult.components?.phq9?.total ?? 0},
          &nbsp;normalized: {(levelResult.components?.phq9?.normalized ?? 0).toFixed(4)},
          &nbsp;answered: {levelResult.components?.phq9?.answered_count ?? 0}/9
        </Descriptions.Item>
        <Descriptions.Item label="Classifier">
          label: {levelResult.components?.classifier?.label ?? "—"},
          &nbsp;raw: {(levelResult.components?.classifier?.confidence_raw ?? levelResult.components?.classifier?.confidence ?? 0).toFixed(4)},
          &nbsp;calibrated: {(levelResult.components?.classifier?.confidence_calibrated ?? levelResult.components?.classifier?.confidence ?? 0).toFixed(4)}
        </Descriptions.Item>
        <Descriptions.Item label="Emotion">
          {levelResult.components?.classifier?.emotion ?? "—"} (binary: {levelResult.components?.classifier?.emotion_binary ?? 0})
        </Descriptions.Item>
        <Descriptions.Item label="Weights">
          PHQ9 {levelResult.weights?.phq9},&nbsp;
          Classifier {levelResult.weights?.classifier},&nbsp;
          Emotion {levelResult.weights?.emotion}
        </Descriptions.Item>
      </Descriptions>
    </>
  )}
</Modal>

      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.sender === "you" ? "items-end" : "items-start"
              }`}
          >
            <div className="flex gap-2 items-center">
              {msg.sender === "you" ? (
                <Avatar username={nickname ?? "User"} />
              ) : (
                <img
                  src={selectedCharacter?.imageUrl}
                  alt="bot"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}

              {loading &&
                msg.sender === "popo" &&
                index === messages.length - 1 ? (
                <Spin size="small" />
              ) : (
                <div
                  className={`p-3 rounded-lg max-w-xs ${msg.sender === "you"
                      ? "bg-inputColorTwo text-left"
                      : "bg-inputColorOne text-left"
                    }`}
                >
                  <Text className="text-sm">{msg.text}</Text>
                </div>
              )}
            </div>
            <Text
              className={`text-xs text-gray-500 mt-1 ${msg.sender === "you" ? "" : "ml-12"
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

      {/*   <Divider className="m-0" />
       */}
      {/* Input bar only if not in PHQ9 chit mode */}
      {!isPhq9 && (
        <div className="flex items-center gap-2 p-4">
          <Input
            placeholder=" Type your message here..."
            size="large"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleSend}
            className="flex-1 bg-inputColorThree rounded-full px-4 py-2 border-none shadow-none focus:ring-0 focus:border-none hover:bg-inputColorThree"
            disabled={loading}
          />
          <Divider className="h-8 bg-white" type="vertical" />
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
      )}
    </div>
  );
};

export default ChatBox;
