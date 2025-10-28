// src/services/ChatBotService.ts

const metadataServiceURL = "http://localhost:8000/";

export async function chatBotService(
  history: string,
  userQuery: string,
  sessionSummaries: string[],
  askedPhqIds: number[],
  language: string
): Promise<{
  response: string;
  phq9_questionID: number | null;
  phq9_question: string | null;
  language: string;
}> {
  try {
    const endpoint = language === "Sinhala" ? "ask-si" : "ask";

    const response = await fetch(`${metadataServiceURL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_query: userQuery,
        history,
        summaries: sessionSummaries,
        asked_phq_ids: askedPhqIds,
      }),
    });

    const data = await response.json();
    console.log(`Backend ${endpoint} response:`, data);

    return {
      response: data.response,
      phq9_questionID: data.phq9_questionID ?? null,
      phq9_question: data.phq9_question ?? null,
      language: data.language ?? language, 
    };
  } catch (error) {
    console.error("chatBotService error:", error);
    return {
      response: "Sorry, something went wrong.",
      phq9_questionID: null,
      phq9_question: null,
      language, 
    };
  }
}

export async function profileDetailsService(
  virtualName: string,
  character: string,
  inputMethod: string
): Promise<any> {
  try {
    const res = await fetch(`${metadataServiceURL}user/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ virtualName, character, inputMethod }),
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error submitting virtual login:", error);
  }
}
