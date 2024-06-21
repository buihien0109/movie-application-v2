import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const actorApi = createApi({
    reducerPath: "actorApi",
    baseQuery: baseQuery,
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

export const {
    useGetActorsQuery,
    useGetActorByIdQuery,
    useCreateActorMutation,
    useUpdateActorMutation,
    useDeleteActorMutation,
} = actorApi;
