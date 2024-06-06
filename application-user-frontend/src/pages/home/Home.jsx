import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useGetLatestBlogsQuery } from "../../app/apis/blog.api";
import { useGetHotMovieQuery, useGetLatestMoviesByTypeQuery } from "../../app/apis/movie.api";
import ErrorPage from "../../components/error/ErrorPage";
import Loading from "../../components/loading/Loading";
import { formatDate } from "../../utils/functionUtils";
import { parseMovieType } from "../../utils/movieUtils";

function Home() {
    const navigationNextRef = useRef(null);
    const navigationPrevRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const {
        data: phimHotData,
        isLoading: isLoadingGetPhimHot,
        isError: isErrorGetPhimHot
    } = useGetHotMovieQuery({ limit: 8 });
    const {
        data: phimBoData,
        isLoading: isLoadingGetPhimBo,
        isError: isErrorGetPhimBo
    } = useGetLatestMoviesByTypeQuery({
        type: "PHIM_BO",
        limit: 6,
    });
    const { data: phimLeData,
        isLoading: isLoadingGetPhimLe,
        isError: isErrorGetPhimLe
    } = useGetLatestMoviesByTypeQuery({
        type: "PHIM_LE",
        limit: 6,
    });
    const { data: phimChieuRapData,
        isLoading: isLoadingGetPhimChieuRap,
        isError: isErrorGetPhimChieuRap
    } = useGetLatestMoviesByTypeQuery({
        type: "PHIM_CHIEU_RAP",
        limit: 6,
    });
    const { data: latestBlogsData,
        isLoading: isLoadingGetBlog,
        isError: isErrorGetBlog
    } = useGetLatestBlogsQuery({ limit: 4 });

    if (isLoadingGetPhimHot || isLoadingGetPhimBo || isLoadingGetPhimLe || isLoadingGetPhimChieuRap || isLoadingGetBlog) {
        return <Loading />
    }

    if (isErrorGetPhimHot || isErrorGetPhimBo || isErrorGetPhimLe || isErrorGetPhimChieuRap || isErrorGetBlog) {
        return <ErrorPage />
    }

    return (
        <>
            <Helmet>
                <title>Trang chủ</title>
            </Helmet>
            <section className="py-4">
                <div className="container">
                    <h3 className="mb-3">Phim HOT</h3>
                    <div className="movie-list owl-carousel position-relative">
                        <Swiper
                            slidesPerView={4}
                            slidesPerGroup={1}
                            spaceBetween={20}
                            navigation={{
                                prevEl: isBeginning ? null : navigationPrevRef.current,
                                nextEl: isEnd ? null : navigationNextRef.current,
                            }}
                            modules={[Navigation]}
                            onInit={(swiper) => {
                                setIsBeginning(swiper.isBeginning);
                                setIsEnd(swiper.isEnd);
                                swiper.params.navigation.prevEl = navigationPrevRef.current;
                                swiper.params.navigation.nextEl = navigationNextRef.current;
                                swiper.navigation.init();
                                swiper.navigation.update();
                            }}
                            onSlideChange={(swiper) => {
                                setIsBeginning(swiper.isBeginning);
                                setIsEnd(swiper.isEnd);
                                swiper.params.navigation.prevEl = navigationPrevRef.current;
                                swiper.params.navigation.nextEl = navigationNextRef.current;
                                swiper.navigation.init();
                                swiper.navigation.update();
                            }}
                        >
                            {phimHotData?.map(movie => (
                                <SwiperSlide key={movie.id}>
                                    <div className="movie-item">
                                        <Link to={`/phim/${movie.id}/${movie.slug}`} className="movie-media">
                                            <div className="movie-poster rounded overflow-hidden position-relative">
                                                <img
                                                    className="w-100 h-100"
                                                    src={movie.poster}
                                                    alt={movie.title} />
                                                <span className="position-absolute badge text-bg-danger top-0 start-0 rounded-1">
                                                    {parseMovieType(movie.type)}
                                                </span>
                                            </div>
                                            <p className="mt-2 truncate-1">{movie.title}</p>
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        {!isEnd && (
                            <div ref={navigationNextRef} className='nav-button owl-next'><span><i className="fa-solid fa-angle-right"></i></span></div>
                        )}
                        {!isBeginning && (
                            <div ref={navigationPrevRef} className='nav-button owl-prev'><span><i className="fa-solid fa-angle-left"></i></span></div>
                        )}
                    </div>
                </div>
            </section>

            <section className="py-4">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-3">Phim lẻ mới cập nhật</h3>
                        <Link to={"/phim-bo"} className="text-primary text-decoration-none">Xem thêm</Link>
                    </div>
                    <div className="row">
                        {phimLeData?.map((movie) => (
                            <div key={movie.id} className="col-2">
                                <div className="movie-item">
                                    <Link to={`/phim/${movie.id}/${movie.slug}`} className="movie-media">
                                        <div className="movie-poster rounded overflow-hidden">
                                            <img className="w-100 h-100"
                                                src={movie.poster} alt={movie.title} />
                                        </div>
                                        <p className="mt-2 truncate-1">{movie.title}</p>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-4">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-3">Phim bộ mới cập nhật</h3>
                        <Link to={"/phim-bo"} className="text-primary text-decoration-none">Xem thêm</Link>
                    </div>
                    <div className="row">
                        {phimBoData?.map((movie) => (
                            <div key={movie.id} className="col-2">
                                <div className="movie-item">
                                    <Link to={`/phim/${movie.id}/${movie.slug}`} className="movie-media">
                                        <div className="movie-poster rounded overflow-hidden">
                                            <img className="w-100 h-100"
                                                src={movie.poster} alt={movie.title} />
                                        </div>
                                        <p className="mt-2 truncate-1">{movie.title}</p>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-4">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-3">Phim chiếu rạp mới cập nhật</h3>
                        <Link to={"/phim-bo"} className="text-primary text-decoration-none">Xem thêm</Link>
                    </div>
                    <div className="row">
                        {phimChieuRapData?.map((movie) => (
                            <div key={movie.id} className="col-2">
                                <div className="movie-item">
                                    <Link to={`/phim/${movie.id}/${movie.slug}`} className="movie-media">
                                        <div className="movie-poster rounded overflow-hidden">
                                            <img className="w-100 h-100"
                                                src={movie.poster} alt={movie.title} />
                                        </div>
                                        <p className="mt-2 truncate-1">{movie.title}</p>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-4">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-3">Tin tức</h3>
                        <Link to={"/tin-tuc"} className="text-primary text-decoration-none">Xem thêm</Link>
                    </div>
                    <div className="row">
                        {latestBlogsData?.map((blog) => (
                            <div key={blog.id} className="col-6">
                                <div className="blog-item bg-body-tertiary rounded mb-4 overflow-hidden">
                                    <Link to={`/tin-tuc/${blog.id}/${blog.slug}`} className="d-flex">
                                        <div className="blog-thumbnail">
                                            <img src={blog.thumbnail} alt={blog.title} />
                                        </div>
                                        <div className="blog-info p-3">
                                            <h5 className="truncate-1-heading">{blog.title}</h5>
                                            <p className="fst-italic">{formatDate(blog.publishedAt)}</p>
                                            <p className="mb-0 truncate">{blog.description}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
