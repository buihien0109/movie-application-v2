import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_PUBLIC, DOMAIN } from "../../data/constants";

export const genreApi = createApi({
    reducerPath: "genreApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_DOMAIN_PUBLIC }),
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
