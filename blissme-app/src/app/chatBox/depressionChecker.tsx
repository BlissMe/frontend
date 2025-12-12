import React, { useState } from "react";
import { Input, Button, Typography, Modal, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const DepressionChecker: React.FC = () => {
  const [summaryId, setSummaryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!summaryId.trim()) {
      Modal.warning({
        title: "Missing user ID",
        content: "Please enter a valid user ID before checking.",
      });
      return;
    }

    setLoading(true);
    setDetectionResult(null);

    try {
      const response = await fetch("http://localhost:8000/detect_depression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary_id: summaryId }),
      });

      if (!response.ok) {
        throw new Error("Depression detection failed");
      }

      const data = await response.json();
      const resultText = data.depression_detection;

      // Try to open a new popup
      const resultWindow = window.open("", "_blank", "width=400,height=300");

      if (resultWindow) {
        resultWindow.document.write(`
          <html><head><title>Depression Result</title></head><body>
            <h1 style="font-family: sans-serif; text-align: center;">🧠 Depression Check Result</h1>
            <p style="text-align: center; font-size: 24px; font-weight: bold; color: ${
              resultText.includes("No") ? "green" : "red"
            }">
              ${resultText}
            </p>
          </body></html>
        `);
      } else {
        // Fallback: show result in modal
        setDetectionResult(resultText);
      }
    } catch (error) {
      Modal.error({
        title: "Error",
        icon: <ExclamationCircleOutlined />,
        content: "Unable to check depression level. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-gray-50 rounded-xl shadow-md w-full max-w-md mx-auto mt-10">
      <Title level={3}>🧠 Depression Detection</Title>
      <Text type="secondary" className="text-center">
        Enter a session summary ID to check for signs of depression.
      </Text>

      <Input
        placeholder="Enter user ID"
        value={summaryId}
        onChange={(e) => setSummaryId(e.target.value)}
      />

      <Button
        type="primary"
        loading={loading}
        onClick={handleCheck}
        disabled={loading}
        className="w-full"
      >
        Check Now
      </Button>

      {detectionResult && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow border text-center">
          <Text strong style={{ fontSize: 18 }}>
            Result:
          </Text>
          <br />
          <Text
            style={{
              color: detectionResult.includes("No") ? "green" : "red",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {detectionResult}
          </Text>
        </div>
      )}
    </div>
  );
};

export default DepressionChecker;
