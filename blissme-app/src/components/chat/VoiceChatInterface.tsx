import bearnew from "../../assets/images/bearnew.png";
import { useState, useEffect, useRef, useContext } from "react";
import { Button, Typography, Tooltip } from "antd";
import ReactBarsLoader from "../../components/loader/ReactBarLoader";
import { getCurrentTime } from "../../helpers/Time";
import {
  createNewSession,
  fetchChatHistory,
  saveMessage,
  fetchAllSummaries,
} from "../../services/ChatMessageService";
import { savePHQ9Answer } from "../../services/Phq9Service";
import { useCharacterContext } from "../../app/context/CharacterContext";
import {
  AudioMutedOutlined,
  AudioOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  getClassifierResult,
  ClassifierResult,
  getDepressionLevel,
  getDepressionLevelByUserID,
} from "../../services/DetectionService";
import { getTherapyFeedbackReport } from "../../services/TherapyFeedbackService";
import { useNotification } from "../../app/context/notificationContext";
import user from "../../assets/images/user.png";
import {
  getLocalStoragedata,
  setLocalStorageData,
} from "../../helpers/Storage";
import { useNavigate } from "react-router-dom";
import { saveClassifierToServer } from "../../services/ClassifierResults";
import { AuthContext } from "../../app/context/AuthContext";
import { useLocation } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";

const { Text } = Typography;
interface Message {
  text: string;
  sender: "you" | "bot";
  time: string;
}
interface ApiResult {
  audio_url?: string;
  user_query?: string;
  bot_response?: string;
  phq9_questionID?: number;
  phq9_question?: string;
  emotion_history?: string[];
  overall_emotion?: string;
}

const ViceChatInterface = () => {
  const {
    sessionID,
    setSessionID,
    setMessages,
    setChatHistory,
    messages,
    handleLogout,
  } = useContext(AuthContext);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  // const [messages, setMessages] = useState<Message[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isWaitingForBotResponse, setIsWaitingForBotResponse] = useState(false);
  // const [sessionID, setSessionID] = useState<string>("");
  const [sessionSummaries, setSessionSummaries] = useState<string[]>([]);
  const [lastPhq9, setLastPhq9] = useState<{
    id: number;
    question: string;
  } | null>(null);
  const [askedPhq9Ids, setAskedPhq9Ids] = useState<number[]>([]);
  const [isPhq9, setIsPhq9] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResult>({});
  const [emotionHistory, setEmotionHistory] = useState<string[]>([]);
  const { characters } = useCharacterContext();
  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [overallEmotion, setOverallEmotion] = useState<string | null>(null);
  const isCancelledRef = useRef(false);
  const { openNotification } = useNotification();
  const Python_URL = process.env.REACT_APP_Python_API_URL;
  const [detecting, setDetecting] = useState(false);
  const [classifier, setClassifier] = useState<ClassifierResult | null>(null);
  const [isPhq9Complete, setIsPhq9Complete] = useState(false);
  const [levelResult, setLevelResult] = useState<any>(null);
  const [levelOpen, setLevelOpen] = useState(false);
  const [therapyMode, setTherapyMode] = useState(false);
  console.log("therapyMode:", therapyMode);
  const navigate = useNavigate();
  const { selectedCharacter, nickname, fetchCharacters } =
    useCharacterContext();
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
  console.log("awaitingFeedback:", awaitingFeedback);
  const location = useLocation();
  const user_id = getLocalStoragedata("userId") || "";
  const API_Python_URL = process.env.REACT_APP_Python_API_URL;
  console.log("isPhq9Complete", isPhq9Complete);
  const [postPhqMessageCount, setPostPhqMessageCount] = useState(0);
  console.log("postPhqMessageCount", postPhqMessageCount);
  const [therapyFeedbackReport, setTherapyFeedbackReport] =
    useState<string>("");
  const [therapyFeedbackConclusion, setTherapyFeedbackConclusion] =
    useState<string>("");

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  useEffect(() => {
    (async () => {
      let existingSession = getLocalStoragedata("sessionID");
      if (!existingSession) {
        const session = await createNewSession();
        existingSession = session;
        setLocalStorageData("sessionID", session);
      }

      if (!existingSession) return;

      setSessionID(existingSession);

      // Fetch chat history for this session
      const updatedHistory = await fetchChatHistory(existingSession);
      if (Array.isArray(updatedHistory)) {
        const formattedMessages: Message[] = updatedHistory.map((msg: any) => ({
          sender: msg.sender === "bot" ? "bot" : "you",
          text: msg.message,
          time: msg.time || getCurrentTime(),
        }));

        setMessages((prev) => [...prev, ...formattedMessages]);
      }

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
    const hasPlayed = getLocalStoragedata("greetingPlayed");
    if (!hasPlayed) {
      const initialMessage: Message = {
        text: "Hi there, I’m your assistant. How are you feeling today?",
        sender: "bot",
        time: getCurrentTime(),
      };
      setMessages([initialMessage]);

      const audio = new Audio("/greeting.mp3");
      audio.play();
      setLocalStorageData("greetingPlayed", "true");
    }
  }, []);

  useEffect(() => {
    console.log("postPhqMessageCount UPDATED:", postPhqMessageCount);
    if (isPhq9Complete && postPhqMessageCount + 1 >= 2) {
      console.log("Triggering level detection automatically...");
      runLevelDetectionWithoutLogout();
      setPostPhqMessageCount(0);
    }
  }, [postPhqMessageCount]);

  useEffect(() => {
    if (location.pathname === "/chat-new/voice") {
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
          sender: "bot",
          text: "How was your therapy session? Please share your feedback.",
          time: getCurrentTime(),
        };
        setMessages((prev) => [...prev, feedbackMsg]);
        setChatHistory((prev) => [...prev, feedbackMsg]);
        saveMessage(feedbackMsg.text, sessionID, "bot");

        playTTS("How was your therapy session? Please share your feedback.");

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
    if (therapyMode) {
      handleGenerateTherapyFeedbackReport();
    }
  }, []);

  const handleStartRecording = async () => {
    isCancelledRef.current = false; // reset cancellation flag
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      if (!mimeType) {
        openNotification(
          "error",
          "No supported MIME type found for MediaRecorder."
        );
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      recorder.onstop = async () => {
        if (isCancelledRef.current) {
          isCancelledRef.current = false;
          chunks.current = [];
          return;
        }

        const blob = new Blob(chunks.current, { type: "audio/webm" });

        if (!blob || blob.size < 1000) {
          openNotification(
            "error",
            "Recording is too short or empty. Please speak something before sending."
          );
          chunks.current = [];
          return;
        }

        setIsWaitingForBotResponse(true); // set here only if sending valid audio
        await handleSendAudio(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      openNotification("error", "Microphone access denied or error occurred.");
      console.error("Mic error:", err);
    }
  };

  const handleStopRecording = () => {
    setRecording(false);
    setIsWaitingForBotResponse(true);
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const handleSendAudio = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");
    formData.append("asked_phq_ids", JSON.stringify(askedPhq9Ids));
    formData.append("summaries", JSON.stringify(sessionSummaries));
    formData.append("emotion_history", JSON.stringify(emotionHistory));

    try {
      setIsUploading(true);

      // --- Fetch chat history (common for both modes) ---
      const updatedHistory = await fetchChatHistory(sessionID);
      const formattedHistory = Array.isArray(updatedHistory)
        ? updatedHistory.map((msg: any) => ({
            sender: msg.sender === "bot" ? "Bot" : "User",
            text: msg.message,
          }))
        : [];

      const historyText = formattedHistory
        .map((m) => `${m.sender}: ${m.text}`)
        .join("\n");

      formData.append("history", historyText);

      let endpoint = `${Python_URL}/voice-chat`;

      if (therapyMode) {
        endpoint = `${Python_URL}/voice-therapy-agent/chat`;

        const userID = getLocalStoragedata("userId")?.toString() || "guest";
        formData.append("user_id", userID);
        formData.append("session_id", String(sessionID));
        formData.append("level", levelResult.level);
        formData.append(
          "therapy_feedback",
          JSON.stringify(therapyFeedbackConclusion || "")
        );

        console.log("THERAPY MODE ENABLED → using therapy voice API");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      setIsUploading(false);
      setIsBotTyping(true);

      if (!response.ok) {
        const errorText = await response.text();
        openNotification("error", errorText || "Server error");
        return;
      }

      const result = await response.json();
      console.log("FULL RESULT:", result);

      const userMessage: Message = {
        text: result.user_query,
        sender: "you",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, userMessage]);
      await saveMessage(userMessage.text, sessionID, "user");

      if (!therapyMode && lastPhq9) {
        await savePHQ9Answer(
          sessionID,
          lastPhq9.id,
          lastPhq9.question,
          userMessage.text
        );
        setLastPhq9(null);
      }

      if (therapyMode) {
        if (result.isTherapySuggested || result.action === "START_THERAPY") {
          setTherapySuggestion({
            therapy_id: result.therapy_id,
            therapy_name: result.therapy_name,
            therapy_path: result.therapy_path,
            isVisible: true,
          });

          setTherapyInfo({
            name: result.therapy_name,
            id: result.therapy_id,
            description:
              result.therapy_description ||
              "A guided reflection to improve your emotional well-being.",
            path: result.therapy_path,
          });
        }

        // if (result.action === "START_THERAPY") {
        //   navigate(result.therapy_path);
        //   setIsBotTyping(false);
        //   setIsWaitingForBotResponse(false);
        //   return;
        // }
      } else {
        if (
          typeof result.phq9_questionID === "number" &&
          typeof result.phq9_question === "string"
        ) {
          setAskedPhq9Ids((prev) => [...prev, result.phq9_questionID!]);
          setLastPhq9({
            id: result.phq9_questionID,
            question: result.phq9_question,
          });
          setIsPhq9(true);
        }
      }

      const botMessage: Message = {
        text: result.bot_response,
        sender: "bot",
        time: getCurrentTime(),
      };
      await saveMessage(botMessage.text, sessionID, "bot");
      setMessages((prev) => [...prev, botMessage]);

      // Play bot audio
      if (result.audio_base64) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(result.audio_base64), (c) => c.charCodeAt(0))],
          { type: "audio/mpeg" }
        );

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
      console.log("Audio URL:", `${Python_URL}${result.audio_url}`);

      // Handle emotion state
      if (result.emotion_history && Array.isArray(result.emotion_history)) {
        setEmotionHistory(result.emotion_history);
        if (result.emotion_history.length >= 3) {
          setOverallEmotion(result.overall_emotion || null);
          setShowEmotionModal(true);
        }
      }

      setIsBotTyping(false);
      setIsWaitingForBotResponse(false);
    } catch (err) {
      openNotification("error", "Failed to send audio. Please try again.");
      console.error("Upload error:", err);
      setIsUploading(false);
      setIsBotTyping(false);
      setIsWaitingForBotResponse(false);
    }
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
        sender: "bot",
        text: gentleText,
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setChatHistory((prev) => [...prev, botMsg]);
      await saveMessage(botMsg.text, sessionID, "bot");

      playTTS(gentleText);
    }

    // Hide therapy suggestion buttons
    setTherapySuggestion((prev) => ({ ...prev, isVisible: false }));
  };

  const handlePhqAnswer = async (answer: string) => {
    const answerMessage: Message = {
      text: answer,
      sender: "you",
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, answerMessage]);
    setIsPhq9(false);
    setIsBotTyping(true);

    if (lastPhq9) {
      await savePHQ9Answer(sessionID, lastPhq9.id, lastPhq9.question, answer);
      setLastPhq9(null);
    }

    await saveMessage(answer, sessionID, "user");

    // Fetch updated chat history from backend
    const updatedHistory = await fetchChatHistory(sessionID);
    const formattedHistory = Array.isArray(updatedHistory)
      ? updatedHistory.map((msg: any) => ({
          sender: msg.sender === "bot" ? "Bot" : "User",
          text: msg.message,
        }))
      : [];

    // Prepare text history for sending to backend
    const historyText = formattedHistory
      .map((m) => `${m.sender}: ${m.text}`)
      .join("\n");

    // Prepare form data for your backend (assuming similar to handleSendAudio but with empty audio)
    const formData = new FormData();
    formData.append(
      "audio",
      new Blob([], { type: "audio/webm" }),
      "empty.webm"
    ); // empty blob or handle differently
    formData.append("asked_phq_ids", JSON.stringify(askedPhq9Ids));
    formData.append("summaries", JSON.stringify(sessionSummaries));
    formData.append("emotion_history", JSON.stringify(emotionHistory));
    formData.append("history", historyText);

    try {
      const response = await fetch(`${Python_URL}/voice-chat`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        openNotification("error", errorText || "Server error: ");
        setIsBotTyping(false);
        return;
      }

      const result: ApiResult = await response.json();
      setApiResult(result);

      // Save user message was done above; now save bot message from result
      const botMessage: Message = {
        text: result.bot_response || "No response from bot.",
        sender: "bot",
        time: getCurrentTime(),
      };
      await saveMessage(botMessage.text, sessionID, "bot");
      setMessages((prev) => [...prev, botMessage]);

      // Update PHQ9 question if any

      if (
        typeof result.phq9_questionID === "number" &&
        typeof result.phq9_question === "string"
      ) {
        setAskedPhq9Ids((prev) => [...prev, result.phq9_questionID!]);
        setLastPhq9({
          id: result.phq9_questionID,
          question: result.phq9_question,
        });
        setIsPhq9(true);
      }

      // Play audio if any
      if (result.audio_url) {
        const audio = new Audio(`${Python_URL}${result.audio_url}`);
        await audio.play();
      }
    } catch (err) {
      openNotification(
        "error",
        "Failed to process PHQ-9 answer. Please try again."
      );
      console.error("PHQ-9 answer error:", err);
    }

    setIsBotTyping(false);
    setIsWaitingForBotResponse(false);
  };

  async function playTTS(text: string) {
    try {
      const res = await fetch(`${Python_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) return;

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (e) {
      console.warn("TTS failed:", e);
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
      sender: "bot",
      text:
        feedback === "Felt Good"
          ? "I'm glad to hear that! Let's keep the good energy going. How are you feeling now?"
          : feedback === "No Change"
          ? "That’s okay, sometimes progress takes time. Would you like to try a different therapy later?"
          : "I understand it didn’t help much. We can explore something else next time. How do you feel right now?",
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, botReply]);
    setChatHistory((prev) => [...prev, botReply]);
    await saveMessage(botReply.text, sessionID, "bot");
    playTTS(botReply.text);

    setAwaitingFeedback(false);
    setTherapyInfo({});
    localStorage.removeItem("therapyInProgress");
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
      } catch (err) {
        console.error("Failed to persist classifier result:", err);
      }
    } catch (e) {
      console.error("getClassifierResult failed:", e);
    } finally {
      setDetecting(false);
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

  async function runLevelDetection() {
    try {
      await ClassifierResult();

      const resp = await getDepressionLevel();
      if (!resp?.success) throw new Error("level API failed");

      setLevelResult(resp.data);
      //setLevelOpen(true);
      handleLogout();
    } catch (e) {
      console.error(e);
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

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-end w-full h-full p-2 md:p-4 overflow-hidden">
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
        className="relative z-10 w-full md:w-3/4 lg:w-2/3 h-full 
  bg-emerald-200/80 rounded-xl p-4 md:p-6 shadow-lg 
  flex flex-col justify-between mx-auto md:mx-0 md:mr-10 
  mt-4 md:mt-0 overflow-hidden bg-opacity-100"
      >
        <div
          className="flex-1 overflow-y-auto px-2 md:px-4 space-y-4 pb-2"
          id="message-container"
        >
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
                {msg.sender === "you" ? (
                  <img
                    src={user}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={selectedCharacter?.imageUrl}
                    alt="bot"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div className="relative max-w-[80%] md:max-w-md">
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
                  msg.sender === "you" ? "" : "ml-10"
                }`}
              >
                {msg.time}
              </Text>

              {isPhq9 &&
                lastPhq9 &&
                msg.sender === "bot" &&
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
                msg.sender === "bot" &&
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
                (msg.sender === "popo" || msg.sender === "bot") &&
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
          {isUploading && (
            <div className="flex justify-end items-center gap-2">
              <ReactBarsLoader />
              <img
                src={user}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          )}
          {isBotTyping && (
            <div className="flex justify-start items-center gap-2">
              <img
                src={selectedCharacter?.imageUrl}
                alt="bot"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />

              <ReactBarsLoader />
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
                    onClick={() => {
                      setShowTherapyCard(false);
                      const now = Date.now();
                      localStorage.setItem("therapyStartTime", now.toString());
                      localStorage.setItem(
                        "therapyInProgress",
                        JSON.stringify(therapyInfo)
                      );
                      navigate(therapyInfo.path || "/therapy");
                    }}
                  >
                    Start Therapy
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>

        <div className="w-full p-6 flex justify-center gap-6">
          {!recording && !isWaitingForBotResponse && (
            <Tooltip title="Start recording (Mic off)">
              <Button
                type="primary"
                shape="circle"
                size="large"
                onClick={handleStartRecording}
                className="bg-green-400 hover:bg-green-600 text-white"
                aria-label="Turn microphone ON"
                style={{ width: 50, height: 50, fontSize: 24 }}
              >
                <AudioMutedOutlined />
              </Button>
            </Tooltip>
          )}

          {recording && !isWaitingForBotResponse && (
            <>
              <Tooltip title="Stop and send (Mic on)">
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  onClick={() => {
                    if (mediaRecorder && mediaRecorder.state === "recording") {
                      mediaRecorder.stop(); // triggers onstop
                    }
                    setRecording(false);
                    // do NOT set isWaitingForBotResponse here
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  aria-label="Stop microphone and send"
                  style={{ width: 50, height: 50, fontSize: 24 }}
                >
                  <AudioOutlined />
                </Button>
              </Tooltip>

              <Tooltip title="Cancel recording">
                <Button
                  danger
                  shape="circle"
                  size="large"
                  onClick={() => {
                    isCancelledRef.current = true;
                    if (mediaRecorder && mediaRecorder.state === "recording") {
                      mediaRecorder.stop();
                    }
                    chunks.current = [];
                    setRecording(false);
                    setIsWaitingForBotResponse(false);
                    streamRef.current
                      ?.getTracks()
                      .forEach((track) => track.stop());
                  }}
                  aria-label="Cancel recording"
                  style={{ width: 50, height: 50, fontSize: 24 }}
                >
                  ✕
                </Button>
              </Tooltip>
            </>
          )}

          {isWaitingForBotResponse && (
            <Tooltip title="Processing">
              <Button
                shape="circle"
                size="large"
                icon={<LoadingOutlined spin style={{ fontSize: 24 }} />}
                disabled
                className="bg-gray-400 text-white"
                aria-label="Processing"
                style={{ width: 50, height: 50 }}
              />
            </Tooltip>
          )}
        </div>
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

export default ViceChatInterface;
