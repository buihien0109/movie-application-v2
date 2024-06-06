import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { blogApi } from "./apis/blog.api";
import { countryApi } from "./apis/country.api";
import { episodeApi } from "./apis/episode.api";
import { favoriteApi } from "./apis/favorite.api";
import { genreApi } from "./apis/genre.api";
import { historyApi } from "./apis/history.api";
import { movieApi } from "./apis/movie.api";
import { orderApi } from "./apis/order.api";
import { purchaseApi } from "./apis/purchase.api";
import { reviewApi } from "./apis/review.api";
import { userApi } from "./apis/user.api";
import authReducer from "./slices/auth.slice";
import countryReducer from "./slices/country.slice";
import genreReducer from "./slices/genre.slice";

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [movieApi.reducerPath]: movieApi.reducer,
        [blogApi.reducerPath]: blogApi.reducer,
        [countryApi.reducerPath]: countryApi.reducer,
        [genreApi.reducerPath]: genreApi.reducer,
        [favoriteApi.reducerPath]: favoriteApi.reducer,
        [purchaseApi.reducerPath]: purchaseApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [historyApi.reducerPath]: historyApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [episodeApi.reducerPath]: episodeApi.reducer,
        auth: authReducer,
        countries: countryReducer,
        genres: genreReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            movieApi.middleware,
            blogApi.middleware,
            countryApi.middleware,
            genreApi.middleware,
            favoriteApi.middleware,
            purchaseApi.middleware,
            orderApi.middleware,
            historyApi.middleware,
            userApi.middleware,
            reviewApi.middleware,
            episodeApi.middleware
        ),
});

export default store;