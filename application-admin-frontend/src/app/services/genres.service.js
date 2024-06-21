import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const genreApi = createApi({
    reducerPath: "genreApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getGenres: builder.query({
            query: () => '/genres',
            providesTags: ['Genre'],
        }),
        getGenreById: builder.query({
            query: (id) => `/genres/${id}`,
        }),
        createGenre: builder.mutation({
            query: (newGenre) => ({
                url: '/genres',
                method: 'POST',
                body: newGenre,
            }),
            invalidatesTags: [{ type: 'Genre' }],
        }),
        updateGenre: builder.mutation({
            query: ({ id, ...updatedGenre }) => ({
                url: `/genres/${id}`,
                method: 'PUT',
                body: updatedGenre,
            }),
            invalidatesTags: [{ type: 'Genre' }],
        }),
        deleteGenre: builder.mutation({
            query: (id) => ({
                url: `/genres/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Genre' }],
        }),
    }),
});

export const {
    useGetGenresQuery,
    useGetGenreByIdQuery,
    useCreateGenreMutation,
    useUpdateGenreMutation,
    useDeleteGenreMutation,
} = genreApi;
