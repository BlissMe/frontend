const API_Python_URL = process.env.REACT_APP_Python_API_URL;


export async function getTherapyFeedbackReport(userID: string | null) {
    const res = await fetch(`${API_Python_URL}/therapyFeedbackReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: Number(userID), 
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch therapy feedback report");
    }

    return await res.json();
}
