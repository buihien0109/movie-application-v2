import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./components/error-page/NotFoundPage";
import AppLayout from "./components/layout/AppLayout";
import AuthorizeRoutes from "./components/private/AuthorizeRoutes";
import PrivateRoutes from "./components/private/PrivateRoutes";
import ActorCreate from "./pages/actor/actor-create/ActorCreate";
import ActorDetail from "./pages/actor/actor-detail/ActorDetail";
import ActorList from "./pages/actor/actor-list/ActorList";
import BlogCreate from "./pages/blog/blog-create/BlogCreate";
import BlogDetail from "./pages/blog/blog-detail/BlogDetail";
import BlogList from "./pages/blog/blog-list/BlogList";
import OwnBlogList from "./pages/blog/own-blog/OwnBlogList";
import CountryList from "./pages/country/country-list/CountryList";
import CouponList from "./pages/coupon/CouponList";
import Dashboard from "./pages/dashboard/dashboard/Dashboard";
import DirectorCreate from "./pages/director/director-create/DirectorCreate";
import DirectorDetail from "./pages/director/director-detail/DirectorDetail";
import DirectorList from "./pages/director/director-list/DirectorList";
import GenreList from "./pages/genre/genre-list/GenreList";
import Login from "./pages/login/Login";
import MovieCreate from "./pages/movie/movie-create/MovieCreate";
import MovieDetail from "./pages/movie/movie-detail/MovieDetail";
import MovieList from "./pages/movie/movie-list/MovieList";
import OrderCreate from "./pages/order/order-create/OrderCreate";
import OrderDetail from "./pages/order/order-detail/OrderDetail";
import OrderList from "./pages/order/order-list/OrderList";
import UserCreate from "./pages/user/user-create/UserCreate";
import UserDetail from "./pages/user/user-detail/UserDetail";
import UserList from "./pages/user/user-list/UserList";

function App() {
    return (
        <Routes>
            <Route element={<PrivateRoutes />}>
                <Route element={<AuthorizeRoutes requireRoles={["ADMIN"]} />}>
                    <Route path="/admin" element={<AppLayout />}>
                        <Route path="dashboard" element={<Dashboard />}></Route>
                        <Route path="blogs">
                            <Route index element={<BlogList />} />
                            <Route path="own-blogs" element={<OwnBlogList />} />
                            <Route path=":blogId/detail" element={<BlogDetail />} />
                            <Route path="create" element={<BlogCreate />} />
                        </Route>
                        <Route path="users">
                            <Route index element={<UserList />} />
                            <Route path=":userId/detail" element={<UserDetail />} />
                            <Route path="create" element={<UserCreate />} />
                        </Route>
                        <Route path="genres">
                            <Route index element={<GenreList />} />
                        </Route>
                        <Route path="countries">
                            <Route index element={<CountryList />} />
                        </Route>
                        <Route path="actors">
                            <Route index element={<ActorList />} />
                            <Route path=":actorId/detail" element={<ActorDetail />} />
                            <Route path="create" element={<ActorCreate />} />
                        </Route>
                        <Route path="directors">
                            <Route index element={<DirectorList />} />
                            <Route path=":directorId/detail" element={<DirectorDetail />} />
                            <Route path="create" element={<DirectorCreate />} />
                        </Route>
                        <Route path="movies">
                            <Route index element={<MovieList />} />
                            <Route path=":movieId/detail" element={<MovieDetail />} />
                            <Route path="create" element={<MovieCreate />} />
                        </Route>
                        <Route path="coupons">
                            <Route index element={<CouponList />} />
                        </Route>
                        <Route path="orders">
                            <Route index element={<OrderList />} />
                            <Route path=":orderId/detail" element={<OrderDetail />} />
                            <Route path="create" element={<OrderCreate />} />
                        </Route>
                    </Route>
                </Route>
            </Route>
            <Route path="/admin/login" element={<Login />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
