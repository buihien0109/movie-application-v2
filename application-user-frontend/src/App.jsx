import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Route, Routes } from "react-router-dom"
import { countryApi } from "./app/apis/country.api"
import { genreApi } from "./app/apis/genre.api"
import Layout from "./components/layout/Layout"
import PrivatePurchaseMovieStreaming from "./components/private/PrivatePurchaseMovieStreaming"
import PrivateRoutes from "./components/private/PrivateRoutes"
import RedirectRoutes from "./components/redirect/RedirectRoutes"
import ConfirmForgotPassword from "./pages/auth/confirm-forgot-password/ConfirmForgotPassword"
import ConfirmRegistration from "./pages/auth/confirm-registration/ConfirmRegistration"
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword"
import Login from "./pages/auth/login/Login"
import Register from "./pages/auth/register/Register"
import BlogDetails from "./pages/blog/blog-details/BlogDetails"
import BlogList from "./pages/blog/blog-list/BlogList"
import Home from "./pages/home/Home"
import MovieDetails from "./pages/movie/movie-details/MovieDetails"
import MovieStreaming from "./pages/movie/movie-streaming/MovieStreaming"
import PhimBo from "./pages/movie/phim-bo/PhimBo"
import PhimChieuRap from "./pages/movie/phim-chieu-rap/PhimChieuRap"
import PhimLe from "./pages/movie/phim-le/PhimLe"
import QuocGia from "./pages/movie/quoc-gia/QuocGia"
import TheLoai from "./pages/movie/the-loai/TheLoai"
import ConfirmOrder from "./pages/payment/confirm-order/ConfirmOrder"
import PaymentOrder from "./pages/payment/payment-order/PaymentOrder"
import PurchaseMovieDetails from "./pages/store/purchase-movie-details/PurchaseMovieDetails"
import PurchaseMovieStreaming from "./pages/store/purchase-movie-streaming/PurchaseMovieStreaming"
import Store from "./pages/store/store/Store"
import Favorite from "./pages/user/favorite/Favorite"
import OrderHistory from "./pages/user/order-history/OrderHistory"
import Profile from "./pages/user/profile/Profile"
import PurchasedMovie from "./pages/user/purchased-movie/PurchasedMovie"
import WatchHistory from "./pages/user/watch-history/WatchHistory"

function App() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(genreApi.endpoints.getGenres.initiate(undefined))
    dispatch(countryApi.endpoints.getCountries.initiate(undefined))
  }, [])


  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="phim-bo" element={<PhimBo />} />
        <Route path="phim-le" element={<PhimLe />} />
        <Route path="phim-chieu-rap" element={<PhimChieuRap />} />
        <Route path="phim/:movieId/:movieSlug" element={<MovieDetails />} />
        <Route path="xem-phim/:movieId/:movieSlug" element={<MovieStreaming />} />
        <Route path="quoc-gia/:countrySlug" element={<QuocGia />} />
        <Route path="the-loai/:genreSlug" element={<TheLoai />} />

        <Route element={<RedirectRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="dang-nhap" element={<Login />} />
          <Route path="dang-ky" element={<Register />} />
          <Route path="quen-mat-khau" element={<ForgotPassword />} />
          <Route path="dat-lai-mat-khau" element={<ConfirmForgotPassword />} />
          <Route path="xac-thuc-tai-khoan" element={<ConfirmRegistration />} />
        </Route>

        <Route path="tin-tuc">
          <Route index element={<BlogList />} />
          <Route path=":blogId/:blogSlug" element={<BlogDetails />} />
        </Route>

        <Route path="cua-hang">
          <Route index element={<Store />} />
          <Route path="phim/:movieId/:movieSlug" element={<PurchaseMovieDetails />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="thong-tin-ca-nhan" element={<Profile />} />
          <Route path="lich-su-xem-phim" element={<WatchHistory />} />
          <Route path="phim-yeu-thich" element={<Favorite />} />
          <Route path="lich-su-giao-dich" element={<OrderHistory />} />
          <Route path="danh-sach-phim-mua" element={<PurchasedMovie />} />

          <Route path="thanh-toan-don-hang/:orderId" element={<PaymentOrder />} />
          <Route path="xac-nhan-don-hang/:orderId" element={<ConfirmOrder />} />

          <Route path="store/xem-phim/:movieId/:movieSlug" element={<PrivatePurchaseMovieStreaming />}>
            <Route index element={<PurchaseMovieStreaming />} />
          </Route>

        </Route>
      </Route>
    </Routes>
  )
}

export default App
