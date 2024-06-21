import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryPublic } from "./baseQuery";

export const countryApi = createApi({
    reducerPath: "countryApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        getCountries: builder.query({
            query: () => "/countries"
        }),
        getMoviesByCountry: builder.query({
            query: ({ slug, page, limit }) => {
                return {
                    url: `/countries/${slug}/movies`,
                    method: "GET",
                    params: {
                        page, limit
                    }
                }
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    content: response.content.map((movie) => ({
                        ...movie,
                        poster: movie.poster.startsWith("/api") ? `${DOMAIN}${movie.poster}` : movie.poster,
                    })),
                };
            }
        }),
        getCountryBySlug: builder.query({
            query: (slug) => `/countries/${slug}`
        })
    }),
});

export const {
    useGetCountriesQuery,
    useGetMoviesByCountryQuery,
    useGetCountryBySlugQuery
} = countryApi;
