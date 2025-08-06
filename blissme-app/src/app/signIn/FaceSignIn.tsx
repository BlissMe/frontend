import { useState, useRef, useContext } from "react";
import { Button, message, Typography } from "antd";
import Webcam from "react-webcam";
import { CameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNotification } from "../context/notificationContext";
import { setLocalStorageData } from "../../helpers/Storage";
import MessageBubble from "../../components/Background/MessageBubble";
import bg7 from "../../assets/images/b7.jpeg";

const FaceSignin = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(true);
  const { openNotification } = useNotification();
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const { Text } = Typography;

  const handleFaceLogin = async () => {
    if (!webcamRef.current) {
      openNotification("error", "Webcam not ready.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      openNotification("error", "Failed to capture image.");
      return;
    }

    try {
      setLoading(true);

      const fastApiResponse = await fetch(
        "http://localhost:8000/generate-descriptor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageSrc }),
        }
      );

      const fastApiResult = await fastApiResponse.json();

      if (!fastApiResponse.ok) {
        openNotification(
          "error",
          fastApiResult.detail || "Face not detected. Try again."
        );
        return;
      }

      const descriptor = fastApiResult.descriptor;

      const expressResponse = await fetch(
        "http://localhost:8080/authUser/face-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ descriptor }),
        }
      );

      const expressResult = await expressResponse.json();
      if (expressResponse.ok) {
        openNotification("success", "Login successful!");
        setLocalStorageData("token", expressResult.token);
        setToken(expressResult.token);
        navigate("/mode/input-mode", { replace: true });
      } else {
        openNotification(
          "error",
          expressResult.message || "Face not recognized."
        );
      }
    } catch (err) {
      console.error("Face login error:", err);
      openNotification("error", "An error occurred during face login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative z-0 min-h-screen w-full overflow-hidden bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg7})` }}
    >
      <div className="min-h-screen w-full flex items-center justify-center relative z-10">
        <div className="flex flex-col items-center gap-2 w-full md:w-1/2 max-w-[500px] py-8 bg-white rounded-xl shadow-lg">
          <MessageBubble />
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center w-full gap-1 mb-2">
              <Text
                className="text-black text-2xl md:text-3xl font-semibold"
                style={{ fontFamily: "Merienda, cursive" }}
              >
                Face Sign-In
              </Text>
              <Text
                className="text-[15px] font-normal text-center"
                style={{ fontFamily: "Merienda, cursive" }}
              >
                Please look into the camera and capture your face to sign in
                securely.
              </Text>
            </div>
          </div>
          <div className="flex flex-col items-center w-full">
              {isWebcamOn && (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded border mb-4"
                  width={320}
                  height={240}
                />
              )}
              <Button
                type="primary"
                icon={<CameraOutlined />}
                onClick={handleFaceLogin}
                loading={loading}
                    className="w-full md:w-[300px] h-[45px] text-base md:text-lg rounded-full text-white font-bold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
              >
                Face Login
              </Button>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceSignin;
