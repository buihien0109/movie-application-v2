import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const countryApi = createApi({
    reducerPath: "countryApi",
    baseQuery: baseQuery,
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
