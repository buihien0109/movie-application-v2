import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryAuth } from "./baseQuery";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        getPurchasedMoviesByCurrentUser: builder.query({
            query: ({ page, limit }) => {
                return {
                    url: `/movies/purchased`,
                    method: "GET",
                    params: {
                        page: page,
                        limit: limit,
                    },
                };
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    content: response.content.map((movie) => ({
                        ...movie,
                        poster: movie.poster.startsWith("/api") ? `${DOMAIN}${movie.poster}` : movie.poster,
                    })),
                };
            },
        }),
        checkPurchasedMovie: builder.query({
            query: (movieId) => {
                return {
                    url: `/movies/check-purchased`,
                    method: "GET",
                    params: {
                        movieId: movieId,
                    }
                };
            },
        }),
    }),
});

export const {
    useGetPurchasedMoviesByCurrentUserQuery,
    useCheckPurchasedMovieQuery,
} = purchaseApi;