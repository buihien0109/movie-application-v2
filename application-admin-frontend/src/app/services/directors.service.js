import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_ADMIN } from "../../data/constants";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_DOMAIN_ADMIN;

export const directorApi = createApi({
    reducerPath: "directorApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ENDPOINT,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (builder) => ({
        getDirectors: builder.query({
            query: () => "/directors",
            providesTags: ["Director"],
        }),
        getDirectorById: builder.query({
            query: (directorId) => `/directors/${directorId}`,
            providesTags: (result, error, directorId) => [
                { type: "Director", id: directorId },
            ],
        }),
        createDirector: builder.mutation({
            query: (newDirector) => ({
                url: "/directors",
                method: "POST",
                body: newDirector,
            }),
            invalidatesTags: ["Director"],
        }),
        updateDirector: builder.mutation({
            query: ({ directorId, ...updatedDirector }) => ({
                url: `/directors/${directorId}`,
                method: "PUT",
                body: updatedDirector,
            }),
            invalidatesTags: (result, error, { directorId }) => [
                { type: "Director", id: directorId },
            ],
        }),
        deleteDirector: builder.mutation({
            query: (directorId) => ({
                url: `/directors/${directorId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Director"],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetDirectorsQuery,
    useGetDirectorByIdQuery,
    useCreateDirectorMutation,
    useUpdateDirectorMutation,
    useDeleteDirectorMutation,
} = directorApi;
