import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const directorApi = createApi({
    reducerPath: "directorApi",
    baseQuery: baseQuery,
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

export const {
    useGetDirectorsQuery,
    useGetDirectorByIdQuery,
    useCreateDirectorMutation,
    useUpdateDirectorMutation,
    useDeleteDirectorMutation,
} = directorApi;
