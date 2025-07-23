import React, { useState, useEffect, useRef } from "react";
import { Button, Divider, Typography } from "antd";
import { assets } from "../../assets/assets";
import ReactBarsLoader from "../../components/loader/ReactBarLoader";
import { getCurrentTime } from "../../helpers/Time";
import {
  createNewSession,
  fetchChatHistory,
  saveMessage,
  fetchAllSummaries,
} from "../../services/ChatMessageService";
import { savePHQ9Answer } from "../../services/Phq9Service";

const { Text } = Typography;

interface Message {
  text: string;
  sender: "you" | "bot";
  time: string;
}
interface ApiResult {
  audio_url?: string;
  user_query?: string;
  response?: string;
  phq9_questionID?: number;
  phq9_question?: string;
}

const VoiceChatBox: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isWaitingForBotResponse, setIsWaitingForBotResponse] = useState(false);
  const [sessionID, setSessionID] = useState<string>("");
  const [sessionSummaries, setSessionSummaries] = useState<string[]>([]);
  const [lastPhq9, setLastPhq9] = useState<{
    id: number;
    question: string;
  } | null>(null);
  const [askedPhq9Ids, setAskedPhq9Ids] = useState<number[]>([]);
  const [isPhq9, setIsPhq9] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResult>({});

  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const phqOptions = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day",
  ];

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  useEffect(() => {
    (async () => {
      const session = await createNewSession();
      setSessionID(session);

      const allSummaries = await fetchAllSummaries();
      setSessionSummaries(allSummaries);
    })();
  }, []);
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      if (!mimeType) {
        alert("No supported MIME type found for MediaRecorder.");
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
        const blob = new Blob(chunks.current, { type: "audio/webm" });

        if (blob.size < 1000) {
          alert("Recording is too short or empty. Please try again.");
          return;
        }

        await handleSendAudio(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied or error occurred.");
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

    try {
      setIsUploading(true);
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

      const response = await fetch("http://localhost:8000/voice-chat", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      setIsUploading(false);
      setIsBotTyping(true);

      if (!response.ok) {
        const errorText = await response.text();
        alert("Server error: " + errorText);
        return;
      }

      const result = await response.json();
      console.log(result);
      setApiResult(result);

      const userMessage: Message = {
        text: result.user_query,
        sender: "you",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, userMessage]);
      await saveMessage(userMessage.text, sessionID, "user");

      if (lastPhq9) {
        await savePHQ9Answer(
          sessionID,
          lastPhq9.id,
          lastPhq9.question,
          userMessage.text
        );
        setLastPhq9(null);
      }

      if (
        typeof result.phq9_questionID === "number" &&
        typeof result.phq9_question === "string"
      ) {
        const questionID = result.phq9_questionID as number;
        const question = result.phq9_question as string;

        setAskedPhq9Ids((prev) => [...prev, questionID]);
        setLastPhq9({
          id: questionID,
          question: question,
        });
        setIsPhq9(true);
      }

      const botMessage: Message = {
        text: result.bot_response,
        sender: "bot",
        time: getCurrentTime(),
      };
      await saveMessage(botMessage.text, sessionID, "bot");
      setMessages((prev) => [...prev, botMessage]);

      const audio = new Audio(`http://localhost:8000${result.audio_url}`);
      audio.play();

      setIsBotTyping(false);
      setIsWaitingForBotResponse(false);
    } catch (err) {
      alert("Failed to send audio. Please try again.");
      console.error("Upload error:", err);
      setIsUploading(false);
      setIsBotTyping(false);
      setIsWaitingForBotResponse(false);
    }
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

    // Safely use apiResult
    if (
      typeof apiResult.phq9_questionID === "number" &&
      typeof apiResult.phq9_question === "string"
    ) {
      const questionID = apiResult.phq9_questionID;
      const question = apiResult.phq9_question;
      setAskedPhq9Ids((prev) => [...prev, questionID]);
      setLastPhq9({ id: questionID, question });
      setIsPhq9(true);
    }

    const botMessage: Message = {
      text: apiResult.response || "No response from bot.",
      sender: "bot",
      time: getCurrentTime(),
    };

    await saveMessage(botMessage.text, sessionID, "bot");
    setMessages((prev) => [...prev, botMessage]);

    try {
      const audio = new Audio(`http://localhost:8000${apiResult.audio_url}`);
      await audio.play();
    } catch (err) {
      console.error("Failed to play audio:", err);
    }

    setIsBotTyping(false);
    setIsWaitingForBotResponse(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-center py-4">
        <img src={assets.profile} width={120} height={120} alt="Profile" />
      </div>

      <div
        className="flex-1 overflow-y-auto px-4 space-y-6"
        id="message-container"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === "you" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex gap-2">
              <img
                src={msg.sender === "you" ? assets.icon1 : assets.icon2}
                alt=""
                width={40}
                height={40}
              />
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.sender === "you" ? "bg-inputColorTwo" : "bg-inputColorOne"
                }`}
              >
                <Text className="text-sm">{msg.text}</Text>
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
          </div>
        ))}

        {isUploading && (
          <div className="flex justify-end items-center gap-2">
            <img src={assets.icon1} width={40} height={40} alt="" />
            <ReactBarsLoader />
          </div>
        )}
        {isBotTyping && (
          <div className="flex justify-start items-center gap-2">
            <img src={assets.icon2} width={40} height={40} alt="" />
            <ReactBarsLoader />
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      <Divider className="m-0" />

      <div className="flex items-center justify-center p-4 bg-white gap-4">
        <Button
          type="primary"
          onClick={recording ? handleStopRecording : handleStartRecording}
          className="rounded-full"
          disabled={isWaitingForBotResponse}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>
    </div>
  );
};

export default VoiceChatBox;
