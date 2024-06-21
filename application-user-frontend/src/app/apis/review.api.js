import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from "./baseQuery";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: baseQueryAuth,
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