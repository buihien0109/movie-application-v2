import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN_PUBLIC, DOMAIN } from "../../data/constants";

export const blogApi = createApi({
    reducerPath: "blogApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_DOMAIN_PUBLIC }),
    endpoints: (builder) => ({
        getLatestBlogs: builder.query({
            query: ({ limit }) => {
                return {
                    url: `/blogs/latest-blogs`,
                    method: "GET",
                    params: {
                        limit: limit,
                    },
                };
            },
            transformResponse: (response) => {
                return response.map((blog) => ({
                    ...blog,
                    thumbnail: blog.thumbnail.startsWith("/api") ? `${DOMAIN}${blog.thumbnail}` : blog.thumbnail,
                }));
            }
        }),
        getBlogs: builder.query({
            query: ({ page, limit }) => {
                return {
                    url: `/blogs`,
                    method: "GET",
                    params: {
                        page, limit
                    }
                }
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    content: response.content.map((blog) => ({
                        ...blog,
                        thumbnail: blog.thumbnail.startsWith("/api") ? `${DOMAIN}${blog.thumbnail}` : blog.thumbnail,
                    })),
                };
            }
        }),
        getBlogDetail: builder.query({
            query: ({ blogId, blogSlug }) => `/blogs/${blogId}/${blogSlug}`,
            transformResponse: (response) => ({
                ...response,
                thumbnail: response.thumbnail.startsWith("/api") ? `${DOMAIN}${response.thumbnail}` : response.thumbnail,
            })
        }),
    }),
});

export const {
    useGetLatestBlogsQuery,
    useGetBlogsQuery,
    useGetBlogDetailQuery
} = blogApi;
