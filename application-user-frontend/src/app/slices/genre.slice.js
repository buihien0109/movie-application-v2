import { createSlice } from '@reduxjs/toolkit';
import { genreApi } from '../apis/genre.api';

const initialState = []

const genreSlice = createSlice({
    name: "genres",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            genreApi.endpoints.getGenres.matchFulfilled,
            (state, action) => {
                state = action.payload;
                return state;
            }
        );
    }
});

export const { } = genreSlice.actions

export default genreSlice.reducer