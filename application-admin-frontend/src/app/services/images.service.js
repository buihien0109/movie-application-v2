import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const imageApi = createApi({
    reducerPath: "imageApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getImages: builder.query({
            query: () => "/images",
        }),
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: "/images",
                method: "POST",
                body: formData,
            }),
        }),
        deleteImage: builder.mutation({
            query: (imageId) => ({
                url: `/images/${imageId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetImagesQuery,
    useUploadImageMutation,
    useDeleteImageMutation,
} = imageApi;
