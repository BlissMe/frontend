import React, { useState, useEffect, useRef } from "react";
import { Button, Divider, Typography } from "antd";
import { assets } from "../../assets/assets";
import ReactBarsLoader from "../../components/loader/ReactBarLoader";

const { Text } = Typography;

interface Message {
  text: string;
  sender: "you" | "bot";
  time: string;
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

  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

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
          console.log("Captured chunk size:", e.data.size);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        console.log("Total blob size (KB):", blob.size / 1024);

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

    try {
      setIsUploading(true);

      const response = await fetch("http://localhost:8000/voice-chat", {
        method: "POST",
        body: formData,
      });

      setIsUploading(false);
      setIsBotTyping(true);

      if (!response.ok) {
        const errorText = await response.text();
        alert("Server error: " + errorText);
        return;
      }

      const result = await response.json();

      const userMessage: Message = {
        text: result.user_query,
        sender: "you",
        time: getTime(),
      };

      const botMessage: Message = {
        text: result.response,
        sender: "bot",
        time: getTime(),
      };

      setMessages((prev) => [...prev, userMessage]);

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsBotTyping(false);
        setIsWaitingForBotResponse(false);
        const audio = new Audio(`http://localhost:8000${result.audio_url}`);
        audio.play();
      }, 1000);
    } catch (err) {
      alert("Failed to send audio. Please try again.");
      console.error("Upload error:", err);
      setIsUploading(false);
      setIsBotTyping(false);
      setIsWaitingForBotResponse(false);
    }
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
