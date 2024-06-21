import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryAuth } from "./baseQuery";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        changePassword: builder.mutation({
            query: (data) => {
                return {
                    url: "users/update-password",
                    method: "PUT",
                    body: data
                }
            }
        }),
        updateProfile: builder.mutation({
            query: (data) => {
                return {
                    url: `users/update-profile`,
                    method: "PUT",
                    body: data
                }
            }
        }),
        updateAvatar: builder.mutation({
            query: (data) => {
                return {
                    url: `users/update-avatar`,
                    method: "POST",
                    body: data
                }
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    url: `${DOMAIN}${response.url}`
                }
            }
        }),
        getUserProfile: builder.query({
            query: () => `users/profile`,
            transformResponse: (response) => ({
                ...response,
                avatar: response.avatar.startsWith("/api") ? `${DOMAIN}${response.avatar}` : response.avatar,
            }),
        }),
    }),
});

export const {
    useChangePasswordMutation,
    useUpdateProfileMutation,
    useUpdateAvatarMutation,
    useGetUserProfileQuery
} = userApi;