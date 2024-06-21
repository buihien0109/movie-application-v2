import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryPublic } from "./baseQuery";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            transformResponse: (response) => {
                return {
                    ...response,
                    user: {
                        ...response.user,
                        avatar: response.user.avatar.startsWith("/api") ? `${DOMAIN}${response.user.avatar}` : response.user.avatar,
                    }
                }
            }
        }),
        registerAccount: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
            }),
        }),
        forgotPassword: builder.mutation({
            query: ({ email }) => ({
                url: "/auth/forgot-password",
                method: "POST",
                params: {
                    email,
                },
            }),
        }),
        checkForgotPasswordToken: builder.query({
            query: (token) => ({
                url: `/auth/check-forgot-password-token/${token}`,
                method: "GET",
            }),
        }),
        checkRegisterToken: builder.query({
            query: (token) => ({
                url: `/auth/check-register-token/${token}`,
                method: "GET",
            }),
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: "/auth/change-password",
                method: "POST",
                body: data,
            }),
        }),
        refreshToken: builder.mutation({
            query: (refreshToken) => ({
                url: "/auth/refresh-token",
                method: "POST",
                body: {
                    refreshToken,
                },
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterAccountMutation,
    useForgotPasswordMutation,
    useCheckForgotPasswordTokenQuery,
    useChangePasswordMutation,
    useCheckRegisterTokenQuery,
    useRefreshTokenMutation,
} = authApi;