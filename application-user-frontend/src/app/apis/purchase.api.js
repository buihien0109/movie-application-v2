import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN, DOMAIN } from "../../data/constants";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_DOMAIN,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
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