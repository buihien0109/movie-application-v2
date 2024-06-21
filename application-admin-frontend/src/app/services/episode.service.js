import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const episodeApi = createApi({
    reducerPath: "episodeApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        createEpisode: builder.mutation({
            query: (newEpisode) => ({
                url: "/episodes",
                method: "POST",
                body: newEpisode,
            }),
        }),
        updateEpisode: builder.mutation({
            query: ({ episodeId, ...updatedEpisode }) => ({
                url: `/episodes/${episodeId}`,
                method: "PUT",
                body: updatedEpisode,
            }),
        }),
        deleteEpisode: builder.mutation({
            query: (episodeId) => ({
                url: `/episodes/${episodeId}`,
                method: "DELETE",
            }),
        }),
        uploadVideoForEpisode: builder.mutation({
            query: ({ episodeId, formData }) => ({
                url: `/episodes/${episodeId}/upload-video`,
                method: "POST",
                body: formData,
            })
        }),
    }),
});

export const {
    useCreateEpisodeMutation,
    useUpdateEpisodeMutation,
    useDeleteEpisodeMutation,
    useUploadVideoForEpisodeMutation,
} = episodeApi;
