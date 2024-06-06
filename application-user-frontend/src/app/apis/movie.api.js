import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_PUBLIC, DOMAIN } from "../../data/constants";

export const movieApi = createApi({
    reducerPath: "movieApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_DOMAIN_PUBLIC }),
    endpoints: (builder) => ({
        getHotMovie: builder.query({
            query: ({ limit }) => {
                return {
                    url: `/movies/hot-movies`,
                    method: "GET",
                    params: {
                        limit: limit,
                    },
                };
            },
            transformResponse: (response) => {
                return response.map((movie) => ({
                    ...movie,
                    poster: movie.poster.startsWith("/api") ? `${DOMAIN}${movie.poster}` : movie.poster,
                }));
            }
        }),
        getLatestMoviesByType: builder.query({
            query: ({ type, limit }) => {
                return {
                    url: `/movies/latest-movies`,
                    method: "GET",
                    params: {
                        type: type,
                        limit: limit,
                    },
                };
            },
            transformResponse: (response) => {
                return response.map((movie) => ({
                    ...movie,
                    poster: movie.poster.startsWith("/api") ? `${DOMAIN}${movie.poster}` : movie.poster,
                }));
            }
        }),
        getMovieDetail: builder.query({
            query: ({ movieId, movieSlug, accessType }) => {
                return {
                    url: `/movies/${movieId}/${movieSlug}`,
                    method: "GET",
                    params: {
                        accessType: accessType,
                    },
                };
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    poster: response.poster.startsWith("/api") ? `${DOMAIN}${response.poster}` : response.poster,
                    actors: response.actors.map((actor) => ({
                        ...actor,
                        avatar: actor.avatar.startsWith("/api") ? `${DOMAIN}${actor.avatar}` : actor.avatar,
                    })),
                    directors: response.directors.map((director) => ({
                        ...director,
                        avatar: director.avatar.startsWith("/api") ? `${DOMAIN}${director.avatar}` : director.avatar,
                    })),
                };
            }
        }),
        getMoviesByType: builder.query({
            query: ({ type, page, limit }) => {
                return {
                    url: `/movies/get-by-type`,
                    method: "GET",
                    params: {
                        limit: limit,
                        page: page,
                        type: type,
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
            }
        }),
        getReviewsByMovie: builder.query({
            query: ({ movieId, page, limit }) => {
                return {
                    url: `/movies/${movieId}/reviews`,
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
                    content: response.content.map((review) => ({
                        ...review,
                        user: {
                            ...review.user,
                            avatar: review.user.avatar.startsWith("/api") ? `${DOMAIN}${review.user.avatar}` : review.user.avatar,
                        }
                    })),
                };
            }
        }),
        getRelatedMovies: builder.query({
            query: ({ movieId, limit }) => {
                return {
                    url: `/movies/${movieId}/related-movies`,
                    method: "GET",
                    params: {
                        limit: limit,
                    },
                };
            },
            transformResponse: (response) => {
                return response.map((movie) => ({
                    ...movie,
                    poster: movie.poster.startsWith("/api") ? `${DOMAIN}${movie.poster}` : movie.poster,
                }));
            }
        }),
        getEpisodesByMovie: builder.query({
            query: ({ movieId }) => {
                return {
                    url: `/movies/${movieId}/episodes`,
                    method: "GET",
                };
            },
        }),
        getMoviesByAccessType: builder.query({
            query: ({ accessType, page, limit }) => {
                return {
                    url: `/movies/get-by-access-type`,
                    method: "GET",
                    params: {
                        limit: limit,
                        page: page,
                        accessType: accessType,
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
            }
        }),
    }),
});

export const {
    useGetHotMovieQuery,
    useGetLatestMoviesByTypeQuery,
    useGetMovieDetailQuery,
    useGetMoviesByTypeQuery,
    useGetReviewsByMovieQuery,
    useGetRelatedMoviesQuery,
    useGetEpisodesByMovieQuery,
    useGetMoviesByAccessTypeQuery,
} = movieApi;
