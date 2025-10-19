const API_Python_URL = process.env.REACT_APP_Python_API_URL;

export interface User {
    id: string;
    name?: string;
    // add other fields if needed
}

export async function therapyAgentChat(
    userQuery: string,
    depressionLevel: string,
    userID: string,
    sessionID: string
): Promise<{
    response: string;
    action?: string;
    therapy_id?: string;
    therapy_name?: string;
}> {
    const res = await fetch(`${API_Python_URL}/therapy-agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_query: userQuery,
            depression_level: depressionLevel,
            user_id: userID,
            session_id: sessionID
        }),
    });
    return await res.json();
}
