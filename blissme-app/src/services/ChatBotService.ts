
const metadataServiceURL = "http://localhost:8000/";
export async function chatBotService(
  history: string,
  userQuery: string,
  sessionSummaries: string[]
): Promise<string> {
  try {
    const response = await fetch(`${metadataServiceURL}ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_query: userQuery,
        history: history, // send the string history 
        summaries: sessionSummaries.length > 0 ? sessionSummaries : ["No summaries available"],
      }),
    });

    const data = await response.json();
    console.log(data);
    return data.response;
  } catch (error) {
    console.error("chatBotService error:", error);
    return "Sorry, something went wrong.";
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


