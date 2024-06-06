import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_ADMIN } from "../../data/constants";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_DOMAIN_ADMIN;

export const actorApi = createApi({
    reducerPath: "actorApi",
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
        getActors: builder.query({
            query: () => "/actors",
            providesTags: ["Actor"],
        }),
        getActorById: builder.query({
            query: (actorId) => `/actors/${actorId}`,
            providesTags: (result, error, actorId) => [
                { type: "Actor", id: actorId },
            ],
        }),
        createActor: builder.mutation({
            query: (newActor) => ({
                url: "/actors",
                method: "POST",
                body: newActor,
            }),
            invalidatesTags: ["Actor"],
        }),
        updateActor: builder.mutation({
            query: ({ actorId, ...updatedActor }) => ({
                url: `/actors/${actorId}`,
                method: "PUT",
                body: updatedActor,
            }),
            invalidatesTags: (result, error, { actorId }) => [
                { type: "Actor", id: actorId },
            ],
        }),
        deleteActor: builder.mutation({
            query: (actorId) => ({
                url: `/actors/${actorId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Actor"],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetActorsQuery,
    useGetActorByIdQuery,
    useCreateActorMutation,
    useUpdateActorMutation,
    useDeleteActorMutation,
} = actorApi;
