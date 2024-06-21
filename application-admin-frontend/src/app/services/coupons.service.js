import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const couponApi = createApi({
    reducerPath: "couponApi",
    baseQuery: baseQuery,
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
