import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_ADMIN } from "../../data/constants";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_DOMAIN_ADMIN;

export const orderApi = createApi({
    reducerPath: "orderApi",
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

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
} = orderApi;
