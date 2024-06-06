import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN, DOMAIN } from "../../data/constants";

export const historyApi = createApi({
    reducerPath: "historyApi",
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
        getHistoryMovie: builder.query({
            query: ({ movieId, episodeId }) => `/histories/movies/${movieId}/episodes/${episodeId}`
        }),
        getHistoryMoviesByCurrentUser: builder.query({
            query: () => `/histories`,
            transformResponse: (response) => {
                return response.map((history) => ({
                    ...history,
                    movie: {
                        ...history.movie,
                        poster: history.movie.poster.startsWith("/api") ? `${DOMAIN}${history.movie.poster}` : history.movie.poster,
                    }
                }));
            },
            providesTags: ['HistoryMovies']
        }),
        addHistoryMovie: builder.mutation({
            query: (data) => ({
                url: `/histories`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['HistoryMovies']
        }),
        deleteHistoryMovie: builder.mutation({
            query: (id) => ({
                url: `/histories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['HistoryMovies']
        }),
        deleteAllHistoryMovie: builder.mutation({
            query: () => ({
                url: `/histories/delete-all`,
                method: 'DELETE',
            }),
            invalidatesTags: ['HistoryMovies']
        }),
    })
});

export const {
    useGetHistoryMovieQuery,
    useGetHistoryMoviesByCurrentUserQuery,
    useAddHistoryMovieMutation,
    useDeleteHistoryMovieMutation,
    useDeleteAllHistoryMovieMutation
} = historyApi;