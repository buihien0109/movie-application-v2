import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_PUBLIC, DOMAIN } from "../../data/constants";

export const episodeApi = createApi({
    reducerPath: "episodeApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_DOMAIN_PUBLIC }),
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
