import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetEpisodeQuery } from '../../../app/apis/episode.api';
import { useAddToFavoriteMutation, useCheckMovieInFavoriteQuery, useDeleteFavoriteMutation } from '../../../app/apis/favorite.api';
import { useGetEpisodesByMovieQuery, useGetMovieDetailQuery, useGetRelatedMoviesQuery, useGetReviewsByMovieQuery } from '../../../app/apis/movie.api';
import { useCheckPurchasedMovieQuery } from '../../../app/apis/purchase.api';
import { useDeleteReviewMutation } from '../../../app/apis/review.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { formatCurrency, formatDate } from '../../../utils/functionUtils';
import CreateReviewModal from '../../movie/movie-details/components/CreateReviewModal';
import ModalTrailer from '../../movie/movie-details/components/ModalTrailer';
import UpdateReviewModal from '../../movie/movie-details/components/UpdateReviewModal';
import VideoPlayer from '../../movie/movie-streaming/components/VideoPlayer';
import PurchaseModal from '../purchase-movie-details/components/PurchaseModal';

const parseReviewMessage = (rating) => {
  switch (rating) {
    case 1:
      return "Không thích";
    case 2:
      return "Rất tệ";
    case 3:
      return "Tệ";
    case 4:
      return "Dưới trung bình";
    case 5:
      return "Trung bình";
    case 6:
      return "Khá ổn";
    case 7:
      return "Tốt";
    case 8:
      return "Rất tốt";
    case 9:
      return "Tuyệt vời";
    case 10:
      return "Xuất sắc";
    default:
      return "";
  }
}

function PurchaseMovieStreaming() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tap = searchParams.get('tap') || 1;
  const { movieId, movieSlug } = useParams();
  const { isAuthenticated, auth } = useSelector(state => state.auth);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showModalTrailer, setShowModalTrailer] = useState(false);
  const [showModalCreateReview, setShowModalCreateReview] = useState(false);
  const [showModalUpdateReview, setShowModalUpdateReview] = useState(false);
  const [showModalPurchase, setShowModalPurchase] = useState(false);
  const [currentPageReview, setCurrentPageReview] = useState(1);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [reviewSelected, setReviewSelected] = useState(null);
  const reviewContainerRef = useRef(null);
  const screenRef = useRef(null);

  const {
    data: movie,
    isLoading: isLoadingGetMovie,
    isError: isErrorGetMovie
  } = useGetMovieDetailQuery({
    movieId,
    movieSlug,
    accessType: "PAID"
  });

  const {
    data: episodes,
    isLoading: isLoadingGetEpisodes,
    isError: isErrorGetEpisodes
  } = useGetEpisodesByMovieQuery({ movieId });

  const {
    data: relatedMovies,
    isLoading: isLoadingRelatedMovies,
    isError: isErrorRelatedMovies
  } = useGetRelatedMoviesQuery({ movieId, limit: 6 });

  const {
    data: reviewData,
    isLoading: isLoadingGetReviews,
    isError: isErrorGetReviews,
    refetch: refetchReview
  } = useGetReviewsByMovieQuery({ movieId, page: currentPageReview, limit: 5 });

  const {
    data: checkMovieInFavorite,
    isLoading: isLoadingCheckMovieInFavorite,
    isError: isErrorCheckMovieInFavorite
  } = useCheckMovieInFavoriteQuery(movieId, { refetchOnMountOrArgChange: true, skip: !isAuthenticated });

  const {
    data: checkPurchasedMovie,
    isLoading: isLoadingCheckPurchasedMovie,
    isError: isErrorCheckPurchasedMovie
  } = useCheckPurchasedMovieQuery(movieId, { refetchOnMountOrArgChange: true, skip: !isAuthenticated });

  const {
    data: currentEpisode,
    isLoading: isLoadingCurrentEpisode,
    isError: isErrorCurrentEpisode,
  } = useGetEpisodeQuery({ movieId, tap }, { refetchOnMountOrArgChange: true });

  const [addToFavorite] = useAddToFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();
  const [deleteReview] = useDeleteReviewMutation();

  useEffect(() => {
    if (checkMovieInFavorite) {
      setIsFavorite(checkMovieInFavorite.isInFavorite);
    }
  }, [checkMovieInFavorite]);

  useEffect(() => {
    if (checkPurchasedMovie) {
      setIsPurchased(checkPurchasedMovie.isPurchased);
    }
  }, [checkPurchasedMovie]);

  useEffect(() => {
    if (shouldRefetch) {
      refetchReview();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, currentPageReview]);

  if (isLoadingGetMovie || isLoadingGetEpisodes || isLoadingRelatedMovies || isLoadingGetReviews || isLoadingCheckMovieInFavorite || isLoadingCheckPurchasedMovie || isLoadingCurrentEpisode) {
    return <Loading />
  }

  if (isErrorGetMovie || isErrorGetEpisodes || isErrorRelatedMovies || isErrorGetReviews || isErrorCheckMovieInFavorite || isErrorCheckPurchasedMovie || isErrorCurrentEpisode) {
    return <ErrorPage />
  }

  const handleAddToFavorite = (movieId) => {
    addToFavorite({ movieId })
      .unwrap()
      .then((res) => {
        toast.success("Thêm vào yêu thích thành công");
        setIsFavorite(true);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message)
      });
  }

  const handleDeleteFromFavorite = (movieId) => {
    deleteFavorite(movieId)
      .unwrap()
      .then((res) => {
        toast.success("Loại khỏi yêu thích thành công");
        setIsFavorite(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message)
      });
  }

  const handleDeleteReview = (reviewId) => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?");
    if (!isConfirm) {
      return;
    }

    deleteReview(reviewId)
      .unwrap()
      .then((res) => {
        toast.success("Xóa bình luận thành công");
        setCurrentPageReview(1);
        setShouldRefetch(true);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message)
      });
  }

  const handleUpdateReview = (reviewId) => {
    const review = reviewData.content.find(review => review.id == reviewId);
    setReviewSelected(review);
    setShowModalUpdateReview(true);
  }

  const handlePageChange = (page) => {
    setCurrentPageReview(page);
    setShouldRefetch(true);
  }

  const handleScrollToReview = () => {
    reviewContainerRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToScreen = () => {
    screenRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShowModalPurchase = () => {
    if (!isAuthenticated) {
      toast.warn("Vui lòng đăng nhập để mua phim");
      return;
    }

    if (isPurchased) {
      toast.warn("Bạn đã mua phim này rồi");
      return;
    }

    setShowModalPurchase(true);
  }

  return (
    <>
      <Helmet>
        <title>{movie.title}</title>
      </Helmet>

      <section className="py-4">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={"/"} className="text-primary">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={"/cua-hang"} className="text-primary">Cửa hàng</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={`/cua-hang/phim/${movie.id}/${movie.slug}`} className="text-primary">{movie.title}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Xem phim
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <div id="screen" className="py-4 bg-body-tertiary" ref={screenRef}>
        <div className="container">
          <div className="w-100 mx-auto">
            <VideoPlayer
              movie={movie}
              currentEpisode={currentEpisode}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </div>

      <section id="movie-detail" className="py-5">
        <div
          className="bg-movie-detail"
          style={{ backgroundImage: `url(${movie.poster})` }}>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-3">
              <div className="movie-thumbnail position-relative">
                <img
                  className="rounded w-100"
                  src={movie.poster}
                  alt={movie.title}
                />
                <span
                  className="play-icon"
                  onClick={() => setShowModalTrailer(true)}
                >
                  <i className="fa-regular fa-circle-play"></i>
                </span>
                {movie.type == 'PHIM_BO' && (
                  <span className="position-absolute badge text-bg-danger top-0 start-0 rounded-1">Phim bộ</span>
                )}
              </div>
            </div>
            <div className="col-9">
              <div className="movie-info text-white">
                <h2 className="mb-2">{movie.title}</h2>
                {movie.rating && (
                  <div className="d-flex align-items-center mb-3">
                    <span className="rating-icon fs-4 text-yellow-300">
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <span className="fs-3 fw-bold ms-2">{movie.rating}</span>
                  </div>
                )}
                <div>
                  <p className="fw-bold mb-1">Nội dung</p>
                  <p className="text-small opacity-50" th:text="${film.description}">
                    {movie.description}&nbsp;
                    <span className="text-yellow-300 opacity-100">Xem thêm</span>
                  </p>
                </div>
                <div className="d-flex align-content-center">
                  <div className="d-flex flex-column me-3 text-small">
                    <p className="opacity-50 mb-1">Năm phát hành</p>
                    <p className="fw-bold">{movie.releaseYear}</p>
                  </div>
                  <div className="d-flex flex-column me-3 text-small">
                    <p className="opacity-50 mb-1">Thể loại</p>
                    <p className="fw-bold">
                      {movie.genres.map((genre, index) => (
                        <span key={index}>{genre.name}{index < movie.genres.length - 1 ? ', ' : ''}</span>
                      ))}
                    </p>
                  </div>
                  <div className="d-flex flex-column me-3 text-small">
                    <p className="opacity-50 mb-1">Quốc gia</p>
                    <p className="fw-bold">{movie.country.name}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span
                    onClick={() => setShowModalTrailer(true)}
                    className="text-small d-flex me-4 align-items-center text-white"
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="btn-action btn-see-trailer rounded-circle d-flex justify-content-center align-items-center">
                      <i className="fa-solid fa-play"></i>
                    </span>
                    <span className="ms-1">Xem trailer</span>
                  </span>
                  <span
                    onClick={handleScrollToReview}
                    style={{ cursor: 'pointer' }}
                    className="text-small d-flex align-items-center text-white"
                    id="btn-scroll-review"
                  >
                    <span className="btn-action btn-see-review rounded-circle d-flex justify-content-center align-items-center">
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <span className="ms-1">Xem review</span>
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  {!isPurchased && (
                    <button
                      type="button"
                      className="d-inline-block btn btn-danger px-5 py-2 mt-3 rounded me-2 text-white"
                      id="btn-modal-purchase"
                      onClick={handleShowModalPurchase}
                    >
                      <span><i className="fa-solid fa-basket-shopping"></i></span> Mua phim:
                      <span>{formatCurrency(movie.price)}đ</span>
                    </button>
                  )}

                  <div id="btn-wishlist-container">
                    {isAuthenticated && isFavorite && (
                      <button
                        className="d-inline-block btn bg-dark px-5 py-2 mt-3 rounded text-white"
                        onClick={() => handleDeleteFromFavorite(movie.id)}
                      >
                        <span className="me-1"><i className="fa-solid fa-trash-can"></i></span>
                        Loại khỏi yêu thích
                      </button>
                    )}
                    {isAuthenticated && !isFavorite && (
                      <button
                        className="d-inline-block btn bg-dark px-5 py-2 mt-3 rounded text-white"
                        onClick={() => handleAddToFavorite(movie.id)}
                      >
                        <span className="me-1"><i className="fa-solid fa-heart"></i></span>
                        Thêm vào yêu thích
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isAuthenticated && isPurchased && movie.type === "PHIM_BO" && (
        <section className="bg-body-tertiary py-4">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div>
                  <h4 className="mb-3">Tập phim</h4>
                  {episodes?.map((episode) => (
                    <Link
                      key={episode.id}
                      onClick={handleScrollToScreen}
                      to={`/store/xem-phim/${movie.id}/${movie.slug}?tap=${episode.displayOrder}`}
                      className={`btn me-2 ${currentEpisode.displayOrder == episode.displayOrder ? 'btn-danger disabled' : 'btn-dark'}`}
                    >
                      {episode.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="book-ticket" className="py-4">
        <div className="container">
          <div className="row">
            <div className="col-9">
              <section>
                <div className="mb-4">
                  <h4 className="mb-4">Diễn viên & Đoàn làm phim</h4>
                  <div className="d-flex flex-nowrap overflow-auto pb-3">
                    {movie?.directors.map((director) => (
                      <div key={director.id} className="text-center" style={{ flex: "0 0 13%" }}>
                        <img
                          src={director.avatar}
                          alt={director.name}
                          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%" }} />
                        <p className="mb-1 mt-2 text-gray-800 text-semi">{director.name}</p>
                        <p className="mb-0 text-small text-gray-500">Đạo diễn</p>
                      </div>
                    ))}
                    {movie?.actors.map((actor) => (
                      <div key={actor.id} className="text-center" style={{ flex: "0 0 13%" }}>
                        <img
                          src={actor.avatar}
                          alt={actor.name}
                          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%" }} />
                        <p className="mb-1 mt-2 text-gray-800 text-semi">{actor.name}</p>
                        <p className="mb-0 text-small text-gray-500">Đạo diễn</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div id="review-container" ref={reviewContainerRef}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-3">Bình luận</h4>
                    {isAuthenticated && (
                      <button
                        className="btn btn-primary btn-create-review"
                        onClick={() => setShowModalCreateReview(true)}>
                        Viết bình luận
                      </button>
                    )}
                  </div>
                  {!isAuthenticated && (
                    <p th:if="not ${isLogined}">
                      Vui lòng&nbsp;
                      <a href="/dang-nhap" className="text-primary text-decoration-underline">đăng nhập</a>
                      &nbsp;để viết bình luận</p>
                  )}
                  <div className="review-list">
                    {reviewData.totalElements == 0 && (
                      <p className="fst-italic">Chưa có bình luận nào</p>
                    )}
                    {reviewData.totalElements > 0 && reviewData?.content?.map((review) => (
                      <div key={review.id} className="rating-item d-flex align-items-center mb-3 pb-3">
                        <div className="rating-avatar">
                          <img src={review.user.avatar} alt={review.user.name} />
                        </div>
                        <div className="rating-info ms-3">
                          <div className="d-flex align-items-center">
                            <p className="rating-name mb-0">
                              <strong>{review.user.name}</strong>
                            </p>
                            <p className="rating-time mb-0 ms-2">{formatDate(review.createdAt)}</p>
                          </div>
                          <div className="rating-star">
                            <p className="mb-0 fw-medium">
                              <span className="rating-icon me-1"><i className="fa fa-star"></i></span>
                              <span>{review.rating}/10 {parseReviewMessage(review.rating)}</span>
                            </p>
                          </div>
                          <p className="rating-content mt-1 mb-0 text-muted">{review.comment}</p>
                          {isAuthenticated && auth.id == review.user.id && (
                            <div>
                              <button
                                onClick={() => handleUpdateReview(review.id)}
                                style={{ cursor: 'pointer', fontSize: '14px' }}
                                className="border-0 bg-transparent btn-edit-review text-primary me-2 text-decoration-underline">
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                style={{ cursor: 'pointer', fontSize: '14px' }}
                                className="border-0 bg-transparent btn-delete-review text-danger text-decoration-underline">
                                Xóa
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div id="review-pagination" className="d-flex justify-content-center align-items-center">
                    {reviewData?.totalPages > 1 && (
                      <Pagination
                        current={currentPageReview}
                        total={reviewData.totalElements}
                        pageSize={reviewData.size}
                        onChange={handlePageChange}
                        className='text-center'
                      />
                    )}
                  </div>
                </div>
              </section>
            </div>
            <div className="col-3">
              <h4 className="mb-2">Phim liên quan</h4>

              <div className="row">
                {relatedMovies.map((movie) => (
                  <div key={movie.id} className="col-12">
                    <div className="movie-showing-now-suggest d-flex py-3 border-bottom">
                      <div className="me-3 movie-thumbnail">
                        <Link to={`/cua-hang/phim/${movie.id}/${movie.slug}`}>
                          <img
                            className="rounded"
                            src={movie.poster}
                            alt={movie.title}
                          />
                        </Link>
                      </div>
                      <div>
                        <p className="mb-1 text-gray-800 fw-semibold text-semi">
                          <Link
                            to={`/cua-hang/phim/${movie.id}/${movie.slug}`}
                            className="text-gray-800 fw-semibold text-semi truncate-1"
                          >{movie.title}</Link>
                        </p>
                        <p className="mb-1 text-small text-gray-500 truncate-1">
                          {movie.genres.map((genre, index) => (
                            <span key={index}>{genre.name}{index < movie.genres.length - 1 ? ', ' : ''}</span>
                          ))}
                        </p>
                        <p className="mb-0 d-flex align-items-center">
                          <span className="text-small">
                            <span className="text-yellow-300"><i className="fa-solid fa-star"></i></span>
                            <span className="text-gray-500">{movie.rating}</span>
                          </span>
                          <span className="text-small text-gray-500 mx-2">|</span>
                          <span className="text-small text-gray-800 fw-semibold">
                            {formatCurrency(movie.price)}đ
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isAuthenticated && showModalPurchase && (
        <PurchaseModal
          show={showModalPurchase}
          handleClose={() => setShowModalPurchase(false)}
          movie={movie}
        />
      )}

      {isAuthenticated && showModalCreateReview && (
        <CreateReviewModal
          movie={movie}
          show={showModalCreateReview}
          handleClose={() => setShowModalCreateReview(false)}
          onPageChange={handlePageChange}
        />
      )}

      {isAuthenticated && showModalUpdateReview && (
        <UpdateReviewModal
          movie={movie}
          review={reviewSelected}
          show={showModalUpdateReview}
          handleClose={() => setShowModalUpdateReview(false)}
          onPageChange={handlePageChange}
        />
      )}

      {showModalTrailer && (
        <ModalTrailer
          movie={movie}
          show={showModalTrailer}
          handleClose={() => setShowModalTrailer(false)}
        />
      )}
    </>
  )
}

export default PurchaseMovieStreaming