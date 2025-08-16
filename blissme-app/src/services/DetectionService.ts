// services/DetectionService.ts
const metadataServiceURL = "http://localhost:8000/";
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
    summaries: string[]
): Promise<ClassifierResult> {
    const res = await fetch(`${metadataServiceURL}detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, summaries }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Detection failed with ${res.status}`);
    }
    return res.json();
}
