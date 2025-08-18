import bearnew from "../../assets/images/bearnew.png";
import React, { useState, useEffect, useRef } from "react";
import { Button, Divider, Typography, Modal, Tooltip } from "antd";
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
import { useCharacterContext } from "../../app/context/CharacterContext";
import {
    AudioMutedOutlined,
    AudioOutlined,
    LoadingOutlined,
    StopOutlined,
} from "@ant-design/icons";
import Avatar from "../../components/profile/Avatar";
import { useNotification } from "../../app/context/notificationContext";

import user from "../../assets/images/user.png";

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
    const [emotionHistory, setEmotionHistory] = useState<string[]>([]);
    const { characters } = useCharacterContext();
    console.log("ch", characters);
    const chunks = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const { selectedCharacter, nickname } = useCharacterContext();
    const [showEmotionModal, setShowEmotionModal] = useState(false);
    const [overallEmotion, setOverallEmotion] = useState<string | null>(null);
    const isCancelledRef = useRef(false);
    const { openNotification } = useNotification();

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
                    // If cancelled, just reset and do nothing
                    isCancelledRef.current = false;
                    return;
                }
                const blob = new Blob(chunks.current, { type: "audio/webm" });
                if (blob.size < 1000) {
                    openNotification(
                        "error",
                        "Recording is too short or empty. Please try again."
                    );
                    return;
                }
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

            setIsUploading(false);
            setIsBotTyping(true);

            if (!response.ok) {
                const errorText = await response.text();
                openNotification("error", errorText || "Server error");
                return;
            }

            const result = await response.json();

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
                setAskedPhq9Ids((prev) => [...prev, result.phq9_questionID!]);
                setLastPhq9({
                    id: result.phq9_questionID,
                    question: result.phq9_question,
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
            const response = await fetch("http://localhost:8000/voice-chat", {
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
                const audio = new Audio(`http://localhost:8000${result.audio_url}`);
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

                <div
                    className="flex-1 overflow-y-auto px-4 space-y-6"
                    id="message-container"
                >
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${msg.sender === "you" ? "items-end" : "items-start"
                                }`}
                        >
                            <div className={`flex gap-2 items-center ${msg.sender === "you" ? "flex-row-reverse" : "flex-row"}`}>
                                {msg.sender === "you" ? (
                                    <img
                                        src={user}
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />) : (
                                    <img
                                        src={selectedCharacter?.imageUrl}
                                        alt="bot"
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                )}
                                <div className="relative max-w-xs">
                                    {msg.sender === "you" ? (
                                        <div className="relative px-5 py-3 bg-gradient-to-br from-red-100 to-red-300 rounded-[40px] shadow text-white text-sm leading-relaxed">
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
                                className={`text-xs text-gray-500 mt-1 ${msg.sender === "you" ? "" : "ml-10"
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
                            <Avatar username={nickname ?? "User"} />
                            <ReactBarsLoader />
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
                                className="bg-green-600 hover:bg-green-700 text-white"
                                aria-label="Turn microphone ON"
                                style={{ width: 70, height: 70, fontSize: 32 }}
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
                                        handleStopRecording();
                                        setRecording(false);
                                        setIsWaitingForBotResponse(true);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    aria-label="Stop microphone and send"
                                    style={{ width: 70, height: 70, fontSize: 32 }}
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
                                    style={{ width: 70, height: 70, fontSize: 28 }}
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
                                icon={<LoadingOutlined spin style={{ fontSize: 32 }} />}
                                disabled
                                className="bg-gray-400 text-white"
                                aria-label="Processing"
                                style={{ width: 70, height: 70 }}
                            />
                        </Tooltip>
                    )}
                </div>

                {/* Emotion Summary Modal */}
                <Modal
                    title="User Emotion Summary"
                    open={showEmotionModal}
                    onOk={() => setShowEmotionModal(false)}
                    onCancel={() => setShowEmotionModal(false)}
                >
                    <p>
                        <strong>Overall Emotion:</strong> {overallEmotion || "N/A"}
                    </p>
                </Modal>
            </div>
        </div>
    );
};

export default ViceChatInterface;
