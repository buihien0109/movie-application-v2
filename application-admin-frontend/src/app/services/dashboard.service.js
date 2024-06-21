import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getDashboardData: builder.query({
            query: () => "/dashboard"
        }),
    }),

});

export const {
    useGetDashboardDataQuery
} = dashboardApi;
