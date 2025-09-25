import { getLocalStoragedata } from "../helpers/Storage";
const API_URL = process.env.REACT_APP_API_URL;

export async function saveClassifierToServer(
  sessionID: number,
  classifier: {
    depression_label:
      | "Depression Signs Detected"
      | "No Depression Signs Detected";
    depression_confidence_detected: number;
    emotion: "happy" | "neutral" | "sad" | "angry" | "fearful";
    emotion_confidence: number;
    rationale: string;
  }
) {
  const token = getLocalStoragedata("token");
  const res = await fetch(`${API_URL}/classifier/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // if your backend uses cookie auth
    body: JSON.stringify({ sessionID, classifier }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Save failed with ${res.status}`);
  }
  return res.json();
}
