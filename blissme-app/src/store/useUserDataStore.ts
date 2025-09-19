import { create } from "zustand";

type LogData = {
  humor: string;
  horasSono: string;
  descricao: string;
  tags: string[];
};

type MoodRecord = {
  data: string;
  humor: string;
  como_se_sentiu: string;
  descricao: string;
  horas_sono: string;
};

type UserDataStore = {
  logData: LogData;
  setLogData: (value: Partial<LogData>) => void;
  logError: boolean;
  setLogError: (value: boolean) => void;
  logedToday: boolean | null;
  setLogedToday: (value: boolean | null) => void;
  userMoodRecord: MoodRecord[];
  setUserMoodRecord: (value: MoodRecord[]) => void;
};

export const useUserDataStore = create<UserDataStore>((set) => ({
  logData: {
    humor: "",
    horasSono: "",
    descricao: "",
    tags: [],
  },
  logError: false,
  logedToday: null,
  userMoodRecord: [],
  setLogData: (value) =>
    set((state) => ({
      logData: {
        ...state.logData,
        ...value,
      },
    })),
  setLogError: (value) => set({ logError: value }),
  setLogedToday: (value) => set({ logedToday: value }),
  setUserMoodRecord: (value) => set({ userMoodRecord: value }),
}));
