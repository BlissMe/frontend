import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const unsubscribeUser = async (subscriberId: string) => {
  try {
    const res = await axios.post(`${API_URL}/mspace/subscribe`, {
      subscriberId,
      action: 0, 
    });

    return { success: true, data: res.data };
  } catch (error) {
    return { success: false };
  }
};
