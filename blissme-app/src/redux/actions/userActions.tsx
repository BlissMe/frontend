// redux/actions/userActions.ts

import axios from "axios";
import { AppDispatch } from "../store";
import {
    setPreferencesRequest,
    setPreferencesSuccess,
    setPreferencesFailure,
} from "../reducers/userReducer";
import { getLocalStoragedata } from '../../helpers/Storage';

const url = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");


export const setUserPreferences =
    (nickname: string, virtualCharacter: number, inputMode: string) =>
        async (dispatch: AppDispatch) => {
            try {
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
