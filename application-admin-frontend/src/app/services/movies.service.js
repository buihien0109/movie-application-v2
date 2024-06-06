import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_ADMIN } from "../../data/constants";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_DOMAIN_ADMIN;

export const movieApi = createApi({
    reducerPath: "movieApi",
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
        getMovies: builder.query({
            query: (status) => {
                if (status) {
                    return `/movies?status=${status}`;
                }
                return "/movies";

            },
            providesTags: ["Movie"],
        }),
        getMovieById: builder.query({
            query: (movieId) => `/movies/${movieId}`,
            providesTags: (result, error, movieId) => [
                { type: "Movie", id: movieId },
            ],
        }),
        createMovie: builder.mutation({
            query: (newMovie) => ({
                url: "/movies",
                method: "POST",
                body: newMovie,
            }),
            invalidatesTags: ["Movie"],
        }),
        updateMovie: builder.mutation({
            query: ({ movieId, ...updatedMovie }) => ({
                url: `/movies/${movieId}`,
                method: "PUT",
                body: updatedMovie,
            }),
            invalidatesTags: (result, error, { movieId }) => [
                { type: "Movie", id: movieId },
            ],
        }),
        deleteMovie: builder.mutation({
            query: (movieId) => ({
                url: `/movies/${movieId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Movie"],
        }),
        getReviewsByMovie: builder.query({
            query: (movieId) => `/movies/${movieId}/reviews`,
        }),
        getEpisodesByMovie: builder.query({
            query: (movieId) => `/movies/${movieId}/episodes`,
        }),
        getMoviesByAccessType: builder.query({
            query: ({accessType, status}) => {
                return {
                    url: `/movies/get-by-access-type`,
                    method: "GET",
                    params: {
                        accessType,
                        status,
                    }
                }
            },
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetMoviesQuery,
    useGetMovieByIdQuery,
    useCreateMovieMutation,
    useUpdateMovieMutation,
    useDeleteMovieMutation,
    useGetReviewsByMovieQuery,
    useGetEpisodesByMovieQuery,
    useGetMoviesByAccessTypeQuery,
} = movieApi;
