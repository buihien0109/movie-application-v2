import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from "./baseQuery";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        getOrdersByCurrentUser: builder.query({
            query: () => `/orders/history`
        }),
        createOrder: builder.mutation({
            query: (data) => ({
                url: `/orders`,
                method: 'POST',
                body: data
            }),
        }),
        getOrderById: builder.query({
            query: (orderId) => `/orders/${orderId}`
        }),
    }),
});

export const {
    useGetOrdersByCurrentUserQuery,
    useCreateOrderMutation,
    useGetOrderByIdQuery
} = orderApi;