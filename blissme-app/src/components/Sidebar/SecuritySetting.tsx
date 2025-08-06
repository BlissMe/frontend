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
  const [isWebcamOn, setIsWebcamOn] = useState(false); // initially false
  const [consentGiven, setConsentGiven] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("1");
  const { openNotification } = useNotification();

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

      // Step 2: Send descriptor to Express backend for registration
      const expressResponse = await fetch(
        "http://localhost:8080/authUser/face-register",
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
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-32">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Biometrics-Face Recongnition</h2>
      <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
        <TabPane tab="Consent Form" key="1">
          <Form layout="vertical" className="w-[380px] sm:w-[400px] space-y-4">
            <div className="bg-gray-100 p-4 rounded text-sm text-gray-700">
              {/* Consent Text */}
              <p className="mb-2 font-semibold text-base">
                Purpose of Data Collection:
              </p>
              <p className="mb-4">
                We use facial recognition to provide a secure and convenient
                method of identity verification. This helps ensure that only
                authorized users can access sensitive parts of the application.
              </p>

              <p className="mb-2 font-semibold text-base">
                How We Use Your Data:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Your facial data will be used only for authentication.</li>
                <li>We do not share your data with third-party services.</li>
                <li>
                  All facial data is stored securely in compliance with data
                  protection regulations.
                </li>
              </ul>

              <p className="mb-2 font-semibold text-base">Your Rights:</p>
              <p className="mb-4">
                You have the right to withdraw your consent at any time by
                contacting support. This may affect your ability to use
                biometric login features.
              </p>

              <p className="mb-2 font-semibold text-base">Security Notice:</p>
              <p className="mb-4">
                All facial images are encrypted and securely transmitted to our
                servers for processing. We implement industry-standard security
                measures to protect your information.
              </p>

              <p className="text-xs italic text-gray-500">
                By checking the box below, you acknowledge that you have read
                and understood the terms above and voluntarily consent to facial
                recognition for authentication purposes.
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
                if (consentGiven) {
                  setActiveTabKey("2");
                } else {
                  message.warning("You must accept the consent to continue.");
                }
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue
            </Button>
          </Form>
        </TabPane>

        <TabPane tab="Face Recognition Setup" key="2" disabled={!consentGiven}>
          <Form layout="vertical" className="w-[380px] sm:w-[400px]">
            <div className="flex justify-center items-center mb-4">
              {isWebcamOn ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded border"
                  width={320}
                  height={240}
                />
              ) : (
                <div
                  className="w-[180px] h-[180px] rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:border-[#3FBFA8] transition"
                  onClick={() => setIsWebcamOn(true)}
                >
                  <CameraOutlined
                    style={{ fontSize: "48px", color: "#3FBFA8" }}
                  />
                </div>
              )}
            </div>

            <Form.Item>
              <div className="flex justify-center items-center">
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  onClick={capture}
                  loading={loading}
                  className="w-[200px] h-[45px] text-base md:text-lg rounded-full text-white font-bold transition-all duration-300 ease-in-out bg-gradient-to-r from-[#6EE7B7] via-[#3FBFA8] to-[#2CA58D] hover:from-[#3FBFA8] hover:via-[#2CA58D] hover:to-[#207F6A]"
                  block
                  disabled={!isWebcamOn}
                >
                  Save Setting
                </Button>
              </div>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SecuritySetting;
