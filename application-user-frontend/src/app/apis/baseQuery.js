import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_DOMAIN, API_DOMAIN_PUBLIC } from '../../data/constants';

export const baseQueryPublic = fetchBaseQuery({
    baseUrl: API_DOMAIN_PUBLIC,
});

export const baseQueryAuth = fetchBaseQuery({
    baseUrl: API_DOMAIN,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});
