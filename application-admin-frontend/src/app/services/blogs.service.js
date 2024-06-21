import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const blogApi = createApi({
    reducerPath: "blogApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: () => "/blogs",
            providesTags: ["Blog"],
        }),
        getOwnBlogs: builder.query({
            query: () => "/blogs/own-blogs",
            providesTags: ["Blog"],
        }),
        getBlogById: builder.query({
            query: (blogId) => `/blogs/${blogId}`,
            providesTags: (result, error, blogId) => [
                { type: "Blog", id: blogId },
            ],
        }),
        createBlog: builder.mutation({
            query: (newBlog) => ({
                url: "/blogs",
                method: "POST",
                body: newBlog,
            }),
            invalidatesTags: ["Blog"],
        }),
        updateBlog: builder.mutation({
            query: ({ blogId, ...updatedBlog }) => ({
                url: `/blogs/${blogId}`,
                method: "PUT",
                body: updatedBlog,
            }),
            invalidatesTags: (result, error, { blogId }) => [
                { type: "Blog", id: blogId },
            ],
        }),
        deleteBlog: builder.mutation({
            query: (blogId) => ({
                url: `/blogs/${blogId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetOwnBlogsQuery,
    useGetBlogByIdQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogApi;
