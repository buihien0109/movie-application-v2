import { createApi } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN } from "../../data/constants";
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
                        avatar: response.user.avatar.startsWith("/api") ? `${API_DOMAIN}${response.user.avatar}` : response.user.avatar,
                    }
                }
            }
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
    useRefreshTokenMutation,
} = authApi;
