import { useState, useRef } from "react";
import { Form, Button, message, Tabs, Checkbox } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { getLocalStoragedata } from "../../helpers/Storage";
import Webcam from "react-webcam";
import { useNotification } from "../../app/context/notificationContext";

const { TabPane } = Tabs;

const SecuritySetting = () => {
  const [email, setEmail] = useState(getLocalStoragedata("user"));
  const webcamRef = useRef<Webcam | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("1");
  const { openNotification } = useNotification();
  const API_URL = process.env.REACT_APP_API_URL;
  const Python_URL = process.env.REACT_APP_Python_API_URL;

  const capture = async () => {
    if (!webcamRef.current) {
      openNotification("error", "Webcam not ready.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      openNotification("error", "Failed to capture image.");
      return;
    }

    if (!email) {
      openNotification("error", "No user found");
      return;
    }

    try {
      setLoading(true);
      console.log("Sending image:", imageSrc);

      // Step 1: Send image to FastAPI to get descriptor
      const fastApiResponse = await fetch(
        `${Python_URL}/generate-descriptor`,
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

      // Step 2: Send descriptor to Express backend for registration
      const expressResponse = await fetch(
        `${API_URL}/authUser/face-register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, descriptor }),
        }
      );

      const expressResult = await expressResponse.json();

      if (expressResponse.ok) {
        openNotification(
          "success",
          expressResult.message || "Face registered successfully!"
        );

        if (webcamRef.current && webcamRef.current.video) {
          const stream = webcamRef.current.video.srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
        }

        setIsWebcamOn(false);
      } else {
        openNotification(
          "error",
          expressResult.message || "Failed to register face."
        );
      }
    } catch (err) {
      console.error("Face registration error:", err);
      openNotification("error", "Error during face registration. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    if (key === "2" && !consentGiven) {
      message.warning("Please accept the consent form before continuing.");
      return;
    }
    setActiveTabKey(key);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-green-300/50 p-4 sm:p-6 rounded-xl shadow-md max-h-screen overflow-auto">

        <h2
          className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center"
          style={{ fontFamily: "Merienda, cursive" }}
        >
          Biometrics - Face Recognition
        </h2>

        <Tabs activeKey={activeTabKey} onChange={handleTabChange} className="w-full">

          {/* ---------------------- CONSENT FORM ---------------------- */}
          <TabPane tab="Consent Form" key="1">
            <Form layout="vertical" className="space-y-4 w-full">

              <div className="bg-gray-100 p-4 rounded text-sm text-gray-700 w-full max-h-[350px] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

                {/* Your Consent Text (unchanged) */}
                <p className="mb-2 font-semibold text-base">Purpose of Data Collection:</p>
                <p className="mb-4">We use facial recognition...</p>

                <p className="mb-2 font-semibold text-base">How We Use Your Data:</p>
                <ul className="list-disc list-inside mb-4">
                  <li>Your facial data will be used only for authentication.</li>
                  <li>We do not share your data with third-party services.</li>
                  <li>All facial data is stored securely...</li>
                </ul>

                <p className="mb-2 font-semibold text-base">Your Rights:</p>
                <p className="mb-4">You have the right to withdraw...</p>

                <p className="mb-2 font-semibold text-base">Security Notice:</p>
                <p className="mb-4">All facial images are encrypted...</p>

                <p className="text-xs italic text-gray-500">
                  By checking the box, you acknowledge...
                </p>
              </div>

              <Form.Item
                name="consent"
                valuePropName="checked"
                rules={[{ required: true, message: "Please accept to continue" }]}
              >
                <Checkbox
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                >
                  I have read and agree to the terms above.
                </Checkbox>
              </Form.Item>

              <Button
                type="primary"
                onClick={() => {
                  if (consentGiven) setActiveTabKey("2");
                  else message.warning("You must accept the consent to continue.");
                }}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-400"
              >
                Continue
              </Button>

            </Form>
          </TabPane>

          {/* ---------------------- FACE RECOGNITION SETUP ---------------------- */}
          <TabPane tab="Face Recognition Setup" key="2" disabled={!consentGiven}>
            <Form layout="vertical" className="w-full max-w-sm mx-auto">

              <div className="flex justify-center items-center mb-4">

                {isWebcamOn ? (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="rounded border w-[260px] h-[200px] sm:w-[320px] sm:h-[240px]"
                  />
                ) : (
                  <div
                    className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:border-[#3FBFA8] transition"
                    onClick={() => setIsWebcamOn(true)}
                  >
                    <CameraOutlined className="text-4xl sm:text-5xl" style={{ color: "#3FBFA8" }} />
                  </div>
                )}

              </div>

              <Form.Item>
                <div className="flex justify-center items-center">
                  <button
                    // type="primary"
                    // icon={<CameraOutlined />}
                    onClick={capture}
                    // loading={loading}
                    className="w-[140px] sm:w-[200px] h-[45px] font-semibold rounded-md text-white text-xl bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:to-[#207F6A]"
                    disabled={!isWebcamOn}
                  >
                    Save Setting
                  </button>
                </div>
              </Form.Item>

            </Form>
          </TabPane>

        </Tabs>
      </div>
    </div>

  );
};

export default SecuritySetting;
