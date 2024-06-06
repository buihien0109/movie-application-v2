import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_ADMIN } from "../../data/constants";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_DOMAIN_ADMIN;

export const couponApi = createApi({
    reducerPath: "couponApi",
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
        getCoupons: builder.query({
            query: () => '/coupons',
            providesTags: ['Coupon'],
        }),
        getCouponById: builder.query({
            query: (id) => `/coupons/${id}`,
        }),
        createCoupon: builder.mutation({
            query: (newCoupon) => ({
                url: '/coupons',
                method: 'POST',
                body: newCoupon,
            }),
            invalidatesTags: [{ type: 'Coupon' }],
        }),
        updateCoupon: builder.mutation({
            query: ({ id, ...updatedCoupon }) => ({
                url: `/coupons/${id}`,
                method: 'PUT',
                body: updatedCoupon,
            }),
            invalidatesTags: [{ type: 'Coupon' }],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Coupon' }],
        }),
    }),
});


export const {
    useGetCouponsQuery,
    useGetCouponByIdQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = couponApi;
