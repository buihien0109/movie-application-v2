import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_PUBLIC } from "../../data/constants";

export const viewLogsApi = createApi({
    reducerPath: "viewLogsApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_DOMAIN_PUBLIC }),
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
