import { createSlice } from '@reduxjs/toolkit';
import { countryApi } from '../apis/country.api';

const initialState = []

const countrySlice = createSlice({
    name: "countries",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            countryApi.endpoints.getCountries.matchFulfilled,
            (state, action) => {
                state = action.payload;
                return state;
            }
        );
    }
});

export const { } = countrySlice.actions

export default countrySlice.reducer