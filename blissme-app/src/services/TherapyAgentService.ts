const API_Python_URL = process.env.REACT_APP_Python_API_URL;

export interface User {
id?: string; 
    userID?: number;
  
}

export async function therapyAgentChat(
    sessionSummaries: string[],
    userQuery: string,
    depressionLevel: string,
    userID: string,
    sessionID: string
): Promise<{
    response: string;
    action?: string;
    therapy_id?: string;
    therapy_name?: string;
    therapy_path?: string; 
     isTherapySuggested?: boolean;
}> {
    const res = await fetch(`${API_Python_URL}/therapy-agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            session_summaries: sessionSummaries,
            user_query: userQuery,
            depression_level: depressionLevel,
            user_id: userID,
            session_id: sessionID,
           
        }),
    });
    return await res.json();
}
