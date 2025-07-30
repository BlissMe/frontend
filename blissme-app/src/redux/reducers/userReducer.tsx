import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserPreferencesState } from "../type";

const initialState: UserPreferencesState = {
    nickname: "",
    virtualCharacter: 1,
    inputMode: "",
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setPreferencesRequest(state) {
            state.loading = true;
            state.error = null;
        },
        setPreferencesSuccess(state, action: PayloadAction<{
            nickname: string;
            virtualCharacter: number;
            inputMode: string;
        }>) {
            state.loading = false;
            state.nickname = action.payload.nickname;
            state.virtualCharacter = action.payload.virtualCharacter;
            state.inputMode = action.payload.inputMode;
            state.error = null;
        },
        setPreferencesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        getPreferencesRequest(state) {
            state.loading = true;
            state.error = null;
        },
        getPreferencesSuccess(state, action: PayloadAction<{
            nickname: string;
            virtualCharacter: number;
            inputMode: string;
        }>) {
            state.loading = false;
            state.nickname = action.payload.nickname;
            state.virtualCharacter = action.payload.virtualCharacter;
            state.inputMode = action.payload.inputMode;
            state.error = null;
        },
        getPreferencesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    setPreferencesRequest,
    setPreferencesSuccess,
    setPreferencesFailure,
    getPreferencesRequest,
    getPreferencesSuccess,
    getPreferencesFailure,
} = userSlice.actions;

export default userSlice.reducer;
