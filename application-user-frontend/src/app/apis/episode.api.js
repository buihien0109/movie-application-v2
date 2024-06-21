import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryPublic } from "./baseQuery";

export const episodeApi = createApi({
    reducerPath: "episodeApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        getEpisode: builder.query({
            query: ({ movieId, tap }) => {
                return {
                    url: `/episodes`,
                    method: "GET",
                    params: {
                        movieId, tap
                    }
                }
            },
            transformResponse: (response) => ({
                ...response,
                videoUrl: response.videoUrl.startsWith("/api") ? `${DOMAIN}${response.videoUrl}` : response.videoUrl
            }),
        }),
    }),
});

export const {
    useGetEpisodeQuery
} = episodeApi;
