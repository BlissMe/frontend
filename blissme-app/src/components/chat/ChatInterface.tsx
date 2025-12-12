import bearnew from "../../assets/images/bearnew.png";
import { Button, Typography, Spin, Input, Divider } from "antd";
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
  getDepressionLevelByUserID,
  startTherapyAPI,
} from "../../services/DetectionService";
import { saveClassifierToServer } from "../../services/ClassifierResults";
import { Modal, Tag, Progress, Descriptions } from "antd";
import { therapyAgentChat, User } from "../../services/TherapyAgentService";
import { getLocalStoragedata } from "../../helpers/Storage";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getTherapyFeedbackReport } from "../../services/TherapyFeedbackService";
import { trackPromise } from "react-promise-tracker";
import { sendSMS } from "../../services/MSpaceSmsService";

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
  const {
    sessionID,
    setSessionID,
    setMessages,
    setChatHistory,
    messages,
    handleLogout,
  } = useContext(AuthContext);

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
  console.log("isPhq9", isPhq9);
  const { selectedCharacter, nickname, fetchCharacters } =
    useCharacterContext();
  const [levelResult, setLevelResult] = useState<any>(null);
  const [levelOpen, setLevelOpen] = useState(false);
  const [therapyMode, setTherapyMode] = useState(false);
  const navigate = useNavigate();
  const [therapySuggestion, setTherapySuggestion] = useState<{
    therapy_id?: string;
    therapy_name?: string;
    therapy_path?: string;
    isVisible: boolean;
  }>({ isVisible: false });
  console.log("therapySuggestion:", therapySuggestion);
  const [showTherapyCard, setShowTherapyCard] = useState(false);
  const [therapyInfo, setTherapyInfo] = useState<{
    name?: string;
    id?: string;
    description?: string;
    duration?: string;
    path?: string;
  }>({});
  console.log("therapyInfo:", therapyInfo);
  const [awaitingFeedback, setAwaitingFeedback] = useState(false);
  const location = useLocation();
  const user_id = getLocalStoragedata("userId") || "";
  const API_Python_URL = process.env.REACT_APP_Python_API_URL;
  const [isPhq9Complete, setIsPhq9Complete] = useState(false);
  console.log("isPhq9Complete", isPhq9Complete);
  const [postPhqMessageCount, setPostPhqMessageCount] = useState(0);
  console.log("postPhqMessageCount", postPhqMessageCount);
  const [therapyFeedbackReport, setTherapyFeedbackReport] =
    useState<string>("");
  const [therapyFeedbackConclusion, setTherapyFeedbackConclusion] =
    useState<string>("");

  console.log("awaitingFeedback", awaitingFeedback);
  console.log("therapyMode", therapyMode);
  console.log("location.pathname", location.pathname);

  useEffect(() => {
    (async () => {
      const session = await createNewSession();
      setSessionID(session);

      const allSummaries = await fetchAllSummaries();
      setSessionSummaries(allSummaries);
    })();
  }, []);

  useEffect(() => {
    if (askedPhq9Ids.length >= 9 && !isPhq9Complete) {
      setIsPhq9Complete(true);
      setPostPhqMessageCount(0);
    }
  }, [askedPhq9Ids]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // adjust to scroll height
    }
  }, [inputValue]);
  useEffect(() => {
    console.log("postPhqMessageCount UPDATED:", postPhqMessageCount);
    if (isPhq9Complete && postPhqMessageCount + 1 >= 2) {
      console.log("Triggering level detection automatically...");
      runLevelDetectionWithoutLogout();
      setPostPhqMessageCount(0);
    }
  }, [postPhqMessageCount]);

  useEffect(() => {
    if (location.pathname === "/chat-new/text") {
      // Check if user just returned from therapy
      const storedTherapy = localStorage.getItem("therapyInProgress");
      if (storedTherapy) {
        const info = JSON.parse(storedTherapy);

        setTherapyInfo(info);
        setAwaitingFeedback(true);

        const startTime = Number(localStorage.getItem("therapyStartTime"));
        const endTime = Date.now();

        const durationInMinutes = ((endTime - startTime) / 1000 / 60).toFixed(
          1
        );

        console.log("Therapy Duration:", durationInMinutes, "minutes");

        // Store duration inside therapyInfo so feedback sending can use it
        setTherapyInfo((prev) => ({
          ...prev,
          duration: durationInMinutes,
        }));

        localStorage.removeItem("therapyStartTime");

        // Add feedback question once
        const feedbackMsg = {
          sender: "popo",
          text: "How was your therapy session? Please share your feedback.",
          time: getCurrentTime(),
        };
        setMessages((prev) => [...prev, feedbackMsg]);
        setChatHistory((prev) => [...prev, feedbackMsg]);
        saveMessage(feedbackMsg.text, sessionID, "bot");

        //  Clear it so it's only asked once
        localStorage.removeItem("therapyInProgress");
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const initTherapyMode = async () => {
      // const savedMode = localStorage.getItem("therapyMode");
      // if (savedMode === "true") {
      //   setTherapyMode(true);
      // }

      //const user: User | null = getLocalStoragedata("user") as User | null;
      // if (!user?.id) return;

      try {
        const resp = await getDepressionLevelByUserID();
        console.log("Depression Level API response:", resp);

        if (
          resp?.success &&
          resp.data &&
          resp.data.components.phq9.answered_count == 9 &&
          resp.data.level != null
        ) {
          setLevelResult(resp.data);
          //  setLevelOpen(true);

          const level = resp.data?.level?.toLowerCase();
          if (level === "moderate" || level === "minimal") {
            setTherapyMode(true);
            localStorage.setItem("therapyMode", "true");
          } else if (level === "severe") {
            setTherapyMode(false);
            localStorage.removeItem("therapyMode");
            navigate("/therapy/all-doctors");
          } else {
            setTherapyMode(false);
            localStorage.removeItem("therapyMode");
          }
        } else {
          setLevelResult(null);
          setTherapyMode(false);
          localStorage.removeItem("therapyMode");
        }
      } catch (err) {
        console.error("Failed to fetch depression level:", err);
        setLevelResult(null);
        setTherapyMode(false);
        localStorage.removeItem("therapyMode");
      }
    };

    initTherapyMode();
  }, []);

  useEffect(() => {
    trackPromise(fetchCharacters());
    sendEmergencySMS();
    if (therapyMode) {
      handleGenerateTherapyFeedbackReport();
    }
  }, []);

  const sendEmergencySMS = async () => {
    const phone = "94763983266"; // no leading 0
    const text =
      "Your session indicates high distress. Please seek help immediately.";

    const response = await sendSMS(phone, text);
    console.log("SMS sent response:", response);
  };

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
    if (therapyMode) {
      // Get user ID from local storage (or your auth context)

      const userID = getLocalStoragedata("userId")?.toString() || "guest";
      console.log("userID in therapy mode:", userID);
      handleGenerateTherapyFeedbackReport();

      botReply = await therapyAgentChat(
        sessionSummaries,
        inputValue,
        levelResult.level,
        userID,
        String(sessionID),
        therapyFeedbackConclusion
      );

      if (botReply.isTherapySuggested) {
        setTherapySuggestion({
          therapy_id: botReply.therapy_id,
          therapy_name: botReply.therapy_name,
          therapy_path: botReply.therapy_path,
          isVisible: true,
        });

        setTherapyInfo({
          name: botReply.therapy_name,
          id: botReply.therapy_id,
          description:
            botReply.therapy_description ||
            "A guided reflection to improve your emotional well-being.",
          // duration:
          //   // botReply.therapy_duration ||
          //   "10–15 minutes",
          path: botReply.therapy_path,
        });
      }
      if (botReply.action === "START_THERAPY") {
        navigate(`${botReply.therapy_path}`);
        setLoading(false);
        return;
      }
    } else {
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

      botReply = await chatBotService(
        context,
        inputValue,
        sessionSummaries,
        askedPhq9Ids,
        Number(user_id),
        Number(sessionID)
      );
      console.log("botReply:", botReply);
      if (isPhq9Complete) {
        setPostPhqMessageCount((prev) => prev + 1);
      }
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

  const handleTherapyChoice = async (choice: "yes" | "no" | "later") => {
    const userChoiceMsg = {
      sender: "you",
      text: choice.charAt(0).toUpperCase() + choice.slice(1), // "Yes" / "No" / "Later"
      time: getCurrentTime(),
    };

    // Add user's choice to chat
    setMessages((prev) => [...prev, userChoiceMsg]);
    setChatHistory((prev) => [...prev, userChoiceMsg]);
    await saveMessage(userChoiceMsg.text, sessionID, "user");

    if (choice === "yes") {
      // Show therapy card (Step 3)
      setShowTherapyCard(true);
      setAwaitingFeedback(true);
    } else {
      // Step 4: Gentle bot message and continue chat
      const gentleText =
        choice === "no"
          ? "No worries, maybe another time. Let’s keep chatting! tell me more about how you're feeling."
          : "Sure, we can try that therapy later when you feel ready. Let’s continue our chat! tell me more about how you're feeling.";

      const botMsg = {
        sender: "popo",
        text: gentleText,
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setChatHistory((prev) => [...prev, botMsg]);
      await saveMessage(botMsg.text, sessionID, "bot");
    }

    // Hide therapy suggestion buttons
    setTherapySuggestion((prev) => ({ ...prev, isVisible: false }));
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

      const res = await getClassifierResult(
        historyStr,
        sessionSummaries ?? [],
        Number(user_id),
        Number(sessionID)
      );
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

  const handleFeedback = async (feedback: string) => {
    const userFeedbackMsg = {
      sender: "you",
      text: feedback,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userFeedbackMsg]);
    setChatHistory((prev) => [...prev, userFeedbackMsg]);
    await saveMessage(feedback, sessionID, "user");

    console.log("userFeedback", userFeedbackMsg);
    // Optional: Send to backend to store therapy feedback
    try {
      // await fetch(`${API_Python_URL}/therapy-agent/feedback`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     user_id: getLocalStoragedata("userId")?.toString() || "guest",
      //     session_id: sessionID,
      //     feedback: feedback,
      //     timestamp: new Date().toISOString(),
      //   }),
      // });
      await fetch(`${API_Python_URL}/therapy-agent/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user_id,
          session_id: sessionID,
          therapy_id: therapyInfo?.id, // FIXED
          duration: Number(therapyInfo?.duration) || 0, // FIXED
          feedback: feedback,
        }),
      });
      console.log("Feedback saved successfully");
    } catch (err) {
      console.error("Failed to save feedback:", err);
    }

    // Bot’s acknowledgment
    const botReply = {
      sender: "popo",
      text:
        feedback === "Felt Good"
          ? "I'm glad to hear that! 🌼 Let's keep the good energy going. How are you feeling now?"
          : feedback === "No Change"
          ? "That’s okay, sometimes progress takes time. Would you like to try a different therapy later?"
          : "I understand it didn’t help much. We can explore something else next time. How do you feel right now?",
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, botReply]);
    setChatHistory((prev) => [...prev, botReply]);
    await saveMessage(botReply.text, sessionID, "bot");

    setAwaitingFeedback(false);
    setTherapyInfo({});
    localStorage.removeItem("therapyInProgress");
  };

  async function runLevelDetection() {
    try {
      await ClassifierResult();

      const resp = await getDepressionLevel();
      if (!resp?.success) throw new Error("level API failed");
      setLevelResult(resp.data);
      //setLevelOpen(true);
      handleLogout();

      // const level = resp.data?.level?.toLowerCase();
      // console.log("level", level);
      // if (level === "minimal" || level === "moderate") {
      //   setTherapyMode(true);
      //   localStorage.setItem("therapyMode", "true");
      // } else {
      //   setTherapyMode(false);
      //   localStorage.removeItem("therapyMode");
      // }
    } catch (e) {
      console.error(e);
    }
  }

  async function runLevelDetectionWithoutLogout() {
    try {
      await ClassifierResult();
      const resp = await getDepressionLevel();
      if (resp?.success) {
        setLevelResult(resp.data);
        //   setLevelOpen(true);
      }
      const level = resp.data?.level?.toLowerCase();
      if (level === "minimal" || level === "moderate") {
        setTherapyMode(true);
        localStorage.setItem("therapyMode", "true");
      } else if (level === "severe") {
        setTherapyMode(false);
        localStorage.removeItem("therapyMode");
        navigate("/therapy/all-doctors");
      } else {
        setTherapyMode(false);
        localStorage.removeItem("therapyMode");
      }
    } catch (err) {
      console.error("Level detection failed:", err);
    }
  }

  const handleGenerateTherapyFeedbackReport = async () => {
    try {
      const userID = getLocalStoragedata("userId");

      const res = await getTherapyFeedbackReport(userID);

      console.log("REPORT:", res.report);
      console.log("CONCLUSION:", res.conclusion);

      setTherapyFeedbackReport(res.report);
      setTherapyFeedbackConclusion(res.conclusion);
    } catch (err) {
      console.error(err);
    }
  };

  const phqOptions = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day",
  ];

  const startTherapy = async () => {
    try {
      // Hide the therapy card
      setShowTherapyCard(false);

      // Store local session details
      const now = Date.now();
      localStorage.setItem("therapyStartTime", now.toString());
      localStorage.setItem("therapyInProgress", JSON.stringify(therapyInfo));

      // Call the service function

      const result = await startTherapyAPI(
        Number(user_id),
        Number(sessionID),
        therapyInfo
      );

      if (result.success) {
        console.log("THERAPY_STARTED event sent successfully!");
      } else {
        console.error("Failed to start therapy:", result.error);
      }

      // Navigate to therapy page
      navigate(therapyInfo.path || "/therapy");
    } catch (err: unknown) {
      let errorMessage = "Unknown error occurred";
      if (err instanceof Error) errorMessage = err.message;
      console.error("Failed to start therapy:", errorMessage);
    }
  };

  return (
    <div className="relative flex-1 px-2  h-screen flex items-center justify-end ">
      {/* Bear Image */}
      <div
        className="
    absolute bottom-0 
    left-1/2 -translate-x-1/2          /* Center on small screens */
    sm:left-8 sm:translate-x-0         /* Original position on larger screens */
    z-0 w-[600px] h-[600px] 
  "
      >
        <img
          src={bearnew}
          alt="Bear"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Chat Box */}
      <div
        className="
    relative z-10 
    w-full lg:w-2/3 md:w-3/4
    h-[90%]  lg:ml-[400px]
    bg-emerald-200/80 bg-opacity-100 rounded-xl p-2 sm:p-6 shadow-lg
    flex flex-col justify-between my-2
    
  "
      >
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
              {therapySuggestion.isVisible &&
                msg.sender === "popo" &&
                index === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-10">
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => handleTherapyChoice("yes")}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                    >
                      Yes
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleTherapyChoice("no")}
                      className="bg-red-100 hover:bg-red-200 border-red-300 rounded-full"
                    >
                      No
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleTherapyChoice("later")}
                      className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300 rounded-full"
                    >
                      Later
                    </Button>
                  </div>
                )}
              {awaitingFeedback &&
                msg.sender === "popo" &&
                index === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-10">
                    {["Felt Good", "No Change", "Didn’t Help"].map((option) => (
                      <Button
                        key={option}
                        size="small"
                        onClick={() => handleFeedback(option)}
                        className={
                          option === "Felt Good"
                            ? "bg-green-500 hover:bg-green-600 text-white rounded-full"
                            : option === "No Change"
                            ? "bg-yellow-100 hover:bg-yellow-200 border-yellow-300 rounded-full"
                            : "bg-red-100 hover:bg-red-200 border-red-300 rounded-full"
                        }
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
          {showTherapyCard && (
            <div className="flex justify-center mt-6">
              <div className="bg-white shadow-lg rounded-2xl p-6 w-[80%] border border-green-200">
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  {therapyInfo.name || "Recommended Therapy"}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {therapyInfo.description ||
                    "This therapy can help you reflect and relax emotionally."}
                </p>
                <p className="text-gray-500 text-xs mb-4">
                  ⏳ Duration: {therapyInfo.duration || "Around 10 minutes"}
                </p>
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                    onClick={startTherapy}
                  >
                    Start Therapy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center w-full gap-3 mb-4">
          {/* Input */}

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
              if (e.key === "Enter" && !e.shiftKey) {
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
                className="w-8 h-8 object-contain"
              />
            }
            onClick={handleSend}
            disabled={loading}
          />
        </div>
        {/* Input Field */}
        {(isPhq9Complete || therapyMode == true) && (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
