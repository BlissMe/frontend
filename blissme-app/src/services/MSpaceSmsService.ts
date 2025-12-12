import { getLocalStoragedata } from "../helpers/Storage";

const API_URL = process.env.REACT_APP_API_URL;
const API_BASE = `${API_URL}`;

export async function sendSMS(phone: string, text: string) {
    const token = getLocalStoragedata("token");

    try {
        const res = await fetch(`${API_BASE}/sms/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ phone, text })
        });

        console.log("SMS API Response:", res);
        return await res.json();
    } catch (err) {
        console.error("Error sending SMS:", err);
        return null;
    }
}