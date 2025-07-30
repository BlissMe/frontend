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
        `${url}/preferences`,
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
      `${url}/get-preferences`,
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
