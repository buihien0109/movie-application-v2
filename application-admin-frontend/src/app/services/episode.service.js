import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_ADMIN } from "../../data/constants";

// Define a service using a base URL and expected endpoints
const ENDPOINT = API_DOMAIN_ADMIN;

export const episodeApi = createApi({
    reducerPath: "episodeApi",
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

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useCreateEpisodeMutation,
    useUpdateEpisodeMutation,
    useDeleteEpisodeMutation,
    useUploadVideoForEpisodeMutation,
} = episodeApi;
