import React, { useState, useEffect, useRef } from "react";
import { Button, Divider, Typography } from "antd";
import { assets } from "../../assets/assets";
const { Text } = Typography;
interface Message {
  text: string;
  sender: "you" | "bot";
  time: string;
}

const VoiceChatBox: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const chunks = useRef<Blob[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunks.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    recorder.onstop = handleSendAudio;

    recorder.start();
    setMediaRecorder(recorder);
  };

  const handleStopRecording = () => {
    setRecording(false);
    mediaRecorder?.stop();
  };

const handleSendAudio = async () => {
  const blob = new Blob(chunks.current, { type: "audio/wav" });
  const formData = new FormData();
  formData.append("audio", blob, "recording.wav");

  try {
    const response = await fetch("http://localhost:8000/voice-chat", {
      method: "POST",
      body: formData,
    });
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

    setMessages((prev) => [...prev, userMessage, botMessage]);

    const audio = new Audio(`http://localhost:8000${result.audio_url}`);
    audio.play();
  } catch (err) {
    console.error("Error:", err);
  }
};

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-center py-4">
        <img src={assets.profile} width={120} height={120} alt="Profile" />
      </div>

      <div
        id="message-container"
        className="flex-1 overflow-y-auto px-4 space-y-6"
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
                  msg.sender === "you"
                    ? "bg-inputColorTwo text-right"
                    : "bg-inputColorOne text-left"
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
        <div ref={messageEndRef} />
      </div>

      <Divider className="m-0" />

      <div className="flex items-center justify-center p-4 bg-white gap-4">
        <Button
          type="primary"
          onClick={recording ? handleStopRecording : handleStartRecording}
          className="rounded-full"
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>
    </div>
  );
};

export default VoiceChatBox;
