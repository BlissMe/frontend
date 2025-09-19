import axios from "axios";
import { getLocalStoragedata } from "../helpers/Storage";

const metadataServiceURL = "http://localhost:8080";

export interface MoodRecord {
  mood: string;
  sleepHours: string;
  reflection: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  tags?: string[];
}

const getAuthHeaders = () => {
  const token = getLocalStoragedata("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const submitMood = async (
  mood: string,
  sleepHours: string,
  reflection: string,
  tags: string[] = [] 
) => {
  try {
    const res = await axios.post(
      `${metadataServiceURL}/moods/log`,
      { mood, sleepHours, reflection, tags },
      getAuthHeaders()
    );
    return { success: true, data: res.data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || "Error logging mood",
    };
  }
};

export const fetchTodayMood = async (): Promise<MoodRecord | null> => {
  try {
    const res = await axios.get(`${metadataServiceURL}/moods/today`, getAuthHeaders());
    return res.data as MoodRecord;
  } catch (err: any) {
    return null;
  }
};

export const fetchAllMoods = async (): Promise<MoodRecord[]> => {
  try {
    const res = await axios.get(`${metadataServiceURL}/moods/all`, getAuthHeaders());
    return res.data as MoodRecord[];
  } catch (err: any) {
    return [];
  }
};
