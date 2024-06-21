import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        updateReview: builder.mutation({
            query: ({ reviewId, ...updatedReview }) => ({
                url: `/reviews/${reviewId}`,
                method: "PUT",
                body: updatedReview,
            }),
        }),
        deleteReview: builder.mutation({
            query: (reviewId) => ({
                url: `/reviews/${reviewId}`,
                method: "DELETE",
            })
        }),
    }),
});

export const {
    useUpdateReviewMutation,
    useDeleteReviewMutation,
} = reviewApi;
