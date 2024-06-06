import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN } from "../../data/constants";

export const orderApi = createApi({
    reducerPath: "orderApi",
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
    }),
});

export const {
    useGetOrdersByCurrentUserQuery,
    useCreateOrderMutation
} = orderApi;