import { create } from "zustand";

type VisibleStore = {
  settingsIsVisible: boolean;
  logIsVisible: boolean;
  setSettingsIsVisible: (value: boolean) => void;
  toggleSettingsIsVisible: () => void;
  setLogIsVisible: (value: boolean) => void;
  toggleLogIsVisible: () => void;
};

export const useVisibleStore = create<VisibleStore>((set) => ({
  settingsIsVisible: false,
  logIsVisible: false,
  setSettingsIsVisible: (value) => set({ settingsIsVisible: value }),
  toggleSettingsIsVisible: () =>
    set((state) => ({ settingsIsVisible: !state.settingsIsVisible })),
  setLogIsVisible: (value) => set({ logIsVisible: value }),
  toggleLogIsVisible: () =>
    set((state) => ({ logIsVisible: !state.logIsVisible })),
}));
