import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryAuth } from "./baseQuery";

export const favoriteApi = createApi({
    reducerPath: "favoriteApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        getFavoritesByCurrentUser: builder.query({
            query: ({ page, limit }) => {
                return {
                    url: "/favorites",
                    method: "GET",
                    params: { page, limit }
                }
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    content: response.content.map((favorite) => ({
                        ...favorite,
                        movie: {
                            ...favorite.movie,
                            poster: favorite.movie.poster.startsWith("/api") ? `${DOMAIN}${favorite.movie.poster}` : favorite.movie.poster,
                        }
                    })),
                };
            },
            providesTags: ["Favorite"],
        }),
        addToFavorite: builder.mutation({
            query: (data) => {
                return {
                    url: "/favorites",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ["Favorite"]
        }),
        deleteFavorite: builder.mutation({
            query: (movieId) => {
                return {
                    url: `/favorites`,
                    method: "DELETE",
                    params: { movieId }
                }
            },
            invalidatesTags: ["Favorite"]
        }),
        checkMovieInFavorite: builder.query({
            query: (movieId) => {
                return {
                    url: `/favorites/check-in-favorite`,
                    method: "GET",
                    params: { movieId }
                }
            },
        }),
    }),
});

export const {
    useGetFavoritesByCurrentUserQuery,
    useAddToFavoriteMutation,
    useDeleteFavoriteMutation,
    useCheckMovieInFavoriteQuery
} = favoriteApi;