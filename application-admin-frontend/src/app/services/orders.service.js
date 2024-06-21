import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: () => "/orders",
            providesTags: ["Order"],
        }),
        getOrderById: builder.query({
            query: (orderId) => `/orders/${orderId}`,
            providesTags: (result, error, orderId) => [
                { type: "Order", id: orderId },
            ],
        }),
        createOrder: builder.mutation({
            query: (newOrder) => ({
                url: "/orders",
                method: "POST",
                body: newOrder,
            }),
            invalidatesTags: ["Order"],
        }),
        updateOrder: builder.mutation({
            query: ({ orderId, ...updatedOrder }) => ({
                url: `/orders/${orderId}`,
                method: "PUT",
                body: updatedOrder,
            }),
            invalidatesTags: (result, error, { orderId }) => [
                { type: "Order", id: orderId },
            ],
        }),
        deleteOrder: builder.mutation({
            query: (orderId) => ({
                url: `/orders/${orderId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Order"],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
} = orderApi;
