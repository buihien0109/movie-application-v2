import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from "./baseQuery";

export const auth2Api = createApi({
    reducerPath: "auth2Api",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        logoutApi: builder.mutation({
            query: () => ({
                url: "/api/auth/logout",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useLogoutApiMutation,
} = auth2Api;