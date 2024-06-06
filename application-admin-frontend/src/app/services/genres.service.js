import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_ADMIN } from "../../data/constants";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_DOMAIN_ADMIN;

export const genreApi = createApi({
    reducerPath: "genreApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ENDPOINT,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        },
    }),
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
