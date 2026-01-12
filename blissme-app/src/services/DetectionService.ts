// services/DetectionService.ts
import { getLocalStoragedata } from "../helpers/Storage";
const API_Python_URL = process.env.REACT_APP_Python_API_URL;
const metadataServiceURL = `${API_Python_URL}/`;
export type EmotionLabel = "happy" | "neutral" | "sad" | "angry" | "fearful";
export type DepressionDetectedLabel = "Depression Signs Detected" | "No Depression Signs Detected";


export interface ClassifierResult {
    depression_label: DepressionDetectedLabel;
    depression_confidence_detected: number;
    emotion: EmotionLabel;
    emotion_confidence: number;
    rationale: string;
}
export async function getClassifierResult(
    history: string,
    summaries: string[],
    user_id:number,
    session_id:number
): Promise<ClassifierResult> {
    const res = await fetch(`${metadataServiceURL}detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, summaries ,user_id,session_id}),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Detection failed with ${res.status}`);
    }
    return res.json();
}

const API_URL = process.env.REACT_APP_API_URL;

const API_BASE = `${API_URL}`;

export async function getDepressionLevel() {
    const token = getLocalStoragedata("token");
    const res = await fetch(`${API_BASE}/levelDetection/depression-index`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Response from getDepressionLevel:", res);
    return await res.json();
}


export async function getDepressionLevelByUserID() {
    const token = getLocalStoragedata("token");
    const res = await fetch(`${API_BASE}/levelDetection/depression-index/latest`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Response from getDepressionLevelByUserID:", res);
    return await res.json();
}

export async function startTherapyAPI(userID: number, sessionID: number, therapyInfo: any) {
  try {
    const token = getLocalStoragedata("token");
    const res = await fetch(`${metadataServiceURL}therapy-agent/end-start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userID,
        session_id: sessionID,
        therapy_id: therapyInfo.id,
        therapy_name: therapyInfo.name,
      }),
    });

    console.log("Response from startTherapyAPI:", res);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err: unknown) {
    let errorMessage = "Unknown error";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    console.error("Failed to call startTherapyAPI:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
