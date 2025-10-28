export interface Character {
    _id: string;
    name: string;
    imageUrl: string;
    characterId: number;
}
// redux/types.ts

export interface UserPreferencesState {
    nickname: string;
    virtualCharacter: number;
    inputMode: string;
    languageMode: string;
    loading: boolean;
    error: string | null;
}

export const SET_PREFERENCES_REQUEST = "SET_PREFERENCES_REQUEST";
export const SET_PREFERENCES_SUCCESS = "SET_PREFERENCES_SUCCESS";
export const SET_PREFERENCES_FAILURE = "SET_PREFERENCES_FAILURE";

interface SetPreferencesRequest {
    type: typeof SET_PREFERENCES_REQUEST;
}

interface SetPreferencesSuccess {
    type: typeof SET_PREFERENCES_SUCCESS;
    payload: {
        nickname: string;
        virtualCharacter: string;
        inputMode: string;
        languageMode: string;
    };
}

interface SetPreferencesFailure {
    type: typeof SET_PREFERENCES_FAILURE;
    payload: string;
}

export type UserPreferencesActionTypes =
    | SetPreferencesRequest
    | SetPreferencesSuccess
    | SetPreferencesFailure;
