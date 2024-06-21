import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryPublic } from "./baseQuery";

export const viewLogsApi = createApi({
    reducerPath: "viewLogsApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        createViewMovieLog: builder.mutation({
            query: (movieId) => ({
                url: "/view-movie-logs",
                method: "POST",
                params: {
                    movieId,
                },
            }),
        }),
    }),
});

export const {
    useCreateViewMovieLogMutation,
} = viewLogsApi;
