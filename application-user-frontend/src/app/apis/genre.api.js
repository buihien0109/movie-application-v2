import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryPublic } from "./baseQuery";

export const genreApi = createApi({
    reducerPath: "genreApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        getGenres: builder.query({
            query: () => "/genres"
        }),
        getMoviesByGenre: builder.query({
            query: ({ slug, page, limit }) => {
                return {
                    url: `/genres/${slug}/movies`,
                    method: "GET",
                    params: {
                        page, limit
                    }
                }
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    content: response.content.map((movie) => ({
                        ...movie,
                        poster: movie.poster.startsWith("/api") ? `${DOMAIN}${movie.poster}` : movie.poster,
                    })),
                };
            }
        }),
        getGenreBySlug: builder.query({
            query: (slug) => `/genres/${slug}`
        })
    }),
});

export const {
    useGetGenresQuery,
    useGetMoviesByGenreQuery,
    useGetGenreBySlugQuery
} = genreApi;
