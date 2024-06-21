import { configureStore } from "@reduxjs/toolkit";
import { checkStatusMiddleware } from "./middlewares/tokenExpirationMiddleware";
import { actorApi } from "./services/actors.service";
import { authApi } from "./services/auth.service";
import { blogApi } from "./services/blogs.service";
import { countryApi } from "./services/countries.service";
import { couponApi } from "./services/coupons.service";
import { dashboardApi } from "./services/dashboard.service";
import { directorApi } from "./services/directors.service";
import { episodeApi } from "./services/episode.service";
import { genreApi } from "./services/genres.service";
import { imageApi } from "./services/images.service";
import { movieApi } from "./services/movies.service";
import { orderApi } from "./services/orders.service";
import { reviewApi } from "./services/reviews.service";
import { userApi } from "./services/users.service";
import authReducer from "./slices/auth.slice";
import imageReducer from "./slices/image.slice";
import { auth2Api } from "./services/auth2.service";

const store = configureStore({
    reducer: {
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [auth2Api.reducerPath]: auth2Api.reducer,
        [blogApi.reducerPath]: blogApi.reducer,
        [genreApi.reducerPath]: genreApi.reducer,
        [countryApi.reducerPath]: countryApi.reducer,
        [imageApi.reducerPath]: imageApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [movieApi.reducerPath]: movieApi.reducer,
        [actorApi.reducerPath]: actorApi.reducer,
        [directorApi.reducerPath]: directorApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [episodeApi.reducerPath]: episodeApi.reducer,
        auth: authReducer,
        images: imageReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            blogApi.middleware,
            genreApi.middleware,
            countryApi.middleware,
            imageApi.middleware,
            authApi.middleware,
            auth2Api.middleware,
            userApi.middleware,
            dashboardApi.middleware,
            movieApi.middleware,
            actorApi.middleware,
            directorApi.middleware,
            reviewApi.middleware,
            couponApi.middleware,
            orderApi.middleware,
            episodeApi.middleware,
            checkStatusMiddleware
        ),
});

export default store;
