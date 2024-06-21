import { createSlice } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_AUTH_KEY } from '../../data/constants';
import { getDataFromLocalStorage, setDataToLocalStorage } from '../../utils/localStorageUtils';
import { authApi } from '../services/auth.service';

const defaultState = {
    auth: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false
}

const initialState = getDataFromLocalStorage(LOCAL_STORAGE_AUTH_KEY)
    ? getDataFromLocalStorage(LOCAL_STORAGE_AUTH_KEY)
    : defaultState

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state, action) => {
            setDataToLocalStorage(LOCAL_STORAGE_AUTH_KEY, defaultState);
            return defaultState;
        },
        updateAuth: (state, action) => {
            state.auth = { ...state.auth, ...action.payload };
            setDataToLocalStorage(LOCAL_STORAGE_AUTH_KEY, state);
        },
        setToken: (state, action) => {
            const { accessToken } = action.payload;
            state.accessToken = accessToken;
            setDataToLocalStorage(LOCAL_STORAGE_AUTH_KEY, state);
        },
        updateInfo: (state, action) => {
            state.auth = action.payload;
            setDataToLocalStorage(LOCAL_STORAGE_AUTH_KEY, state);
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, action) => {
                const { user, accessToken, refreshToken, isAuthenticated } = action.payload;
                state.auth = user;
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
                state.isAuthenticated = isAuthenticated;
                setDataToLocalStorage(LOCAL_STORAGE_AUTH_KEY, state);
            }
        );
    }
});

export const { logout, updateAuth, setToken, updateInfo } = authSlice.actions

export default authSlice.reducer