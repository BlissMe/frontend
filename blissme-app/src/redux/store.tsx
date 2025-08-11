import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import { UserPreferencesState } from "./type";
import { getLocalStoragedata, setLocalStorageData } from "../helpers/Storage";

const loadState = (): { user: UserPreferencesState } | undefined => {
  try {
    const serializedState = getLocalStoragedata("reduxState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn("Failed to load state from localStorage:", err);
    return undefined;
  }
};

const saveState = (state: { user: UserPreferencesState }) => {
  try {
    const serializedState = JSON.stringify(state);
    setLocalStorageData("reduxState", serializedState);
  } catch (err) {
    console.warn("Failed to save state to localStorage:", err);
  }
};

const persistedState = loadState();

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    user: store.getState().user,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
