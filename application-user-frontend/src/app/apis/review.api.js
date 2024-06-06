import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN } from "../../data/constants";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
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
        createReview: builder.mutation({
            query: (data) => {
                return {
                    url: "/reviews",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ["Review"]
        }),
        updateReview: builder.mutation({
            query: ({ reviewId, ...data }) => {
                return {
                    url: `/reviews/${reviewId}`,
                    method: "PUT",
                    body: data
                }
            },
            invalidatesTags: ["Review"]
        }),
        deleteReview: builder.mutation({
            query: (reviewId) => {
                return {
                    url: `/reviews/${reviewId}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: ["Review"]
        }),
    }),
});

export const {
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation
} = reviewApi;