// redux/actions/userActions.ts

import axios from "axios";
import { AppDispatch } from "../store";
import {
  setPreferencesRequest,
  setPreferencesSuccess,
  setPreferencesFailure,
  getPreferencesFailure,
  getPreferencesSuccess,
  getPreferencesRequest,
  updatePreferencesRequest,
  updatePreferencesSuccess,
  updatePreferencesFailure,
} from "../reducers/userReducer";
import { getLocalStoragedata } from "../../helpers/Storage";

const url = process.env.REACT_APP_API_URL;

export const setUserPreferences =
  (nickname: string, virtualCharacter: number, inputMode: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const token = getLocalStoragedata("token");

      console.log("Token retrieved:", token);
      console.log("Calling setUserPreferences with:", {
        nickname,
        virtualCharacter,
        inputMode,
      });

      dispatch(setPreferencesRequest());

      const response = await axios.post(
        `${url}/api/blissme/preferences`,
        {
          nickname,
          virtualCharacter,
          inputMode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // attach token here
          },
        }
      );

      dispatch(
        setPreferencesSuccess({
          nickname,
          virtualCharacter,
          inputMode,
        })
      );
    } catch (error: any) {
      dispatch(
        setPreferencesFailure(
          error?.response?.data?.message || "Error occurred"
        )
      );
    }
  };

interface PreferencesResponse {
  preferences: {
    nickname: string;
    virtualCharacter: number;
    inputMode: string;
  };
}

export const getUserPreferences = () => async (dispatch: AppDispatch) => {
  try {
    const token = getLocalStoragedata("token");

    console.log("Fetching user preferences...");
    dispatch(getPreferencesRequest());

    const response = await axios.get<PreferencesResponse>(
      `${url}/api/blissme/get-preferences`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { nickname, virtualCharacter, inputMode } = response.data.preferences;

    dispatch(
      getPreferencesSuccess({
        nickname,
        virtualCharacter,
        inputMode,
      })
    );
  } catch (error: any) {
    dispatch(
      getPreferencesFailure(
        error?.response?.data?.message || "Failed to fetch preferences"
      )
    );
  }
};

export const updateUserPreferences =
  (nickname?: string, virtualCharacter?: number, inputMode?: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const token = getLocalStoragedata("token");

      dispatch(updatePreferencesRequest());

      const payload: any = {};
      if (nickname !== undefined) payload.nickname = nickname;
      if (virtualCharacter !== undefined) payload.virtualCharacter = virtualCharacter;
      if (inputMode !== undefined) payload.inputMode = inputMode;

      const response = await axios.put(
        `${url}/api/blissme/update-preferences`, 
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        updatePreferencesSuccess({
          nickname: payload.nickname ?? "",
          virtualCharacter: payload.virtualCharacter ?? 1,
          inputMode: payload.inputMode ?? "",
        })
      );
    } catch (error: any) {
      dispatch(
        updatePreferencesFailure(
          error?.response?.data?.message || "Error occurred while updating preferences"
        )
      );
    }
  };

