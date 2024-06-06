import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_ADMIN } from "../../data/constants";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_DOMAIN_ADMIN;

export const countryApi = createApi({
    reducerPath: "countryApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ENDPOINT,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        },
    }),
    endpoints: (builder) => ({
        getCountries: builder.query({
            query: () => '/countries',
            providesTags: ['Country'],
        }),
        getCountryById: builder.query({
            query: (id) => `/countries/${id}`,
        }),
        createCountry: builder.mutation({
            query: (newCountry) => ({
                url: '/countries',
                method: 'POST',
                body: newCountry,
            }),
            invalidatesTags: [{ type: 'Country' }],
        }),
        updateCountry: builder.mutation({
            query: ({ id, ...updatedCountry }) => ({
                url: `/countries/${id}`,
                method: 'PUT',
                body: updatedCountry,
            }),
            invalidatesTags: [{ type: 'Country' }],
        }),
        deleteCountry: builder.mutation({
            query: (id) => ({
                url: `/countries/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Country' }],
        }),
    }),
});


export const {
    useGetCountriesQuery,
    useGetCountryByIdQuery,
    useCreateCountryMutation,
    useUpdateCountryMutation,
    useDeleteCountryMutation,
} = countryApi;
