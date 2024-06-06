import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN, API_DOMAIN_AUTH_PUBLIC } from "../../data/constants";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_DOMAIN_AUTH_PUBLIC;
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery(
        { baseUrl: ENDPOINT }
    ),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
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
    }),
});

export const {
    useLoginMutation
} = authApi;
