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
import { useDeleteReviewMutation } from '../../../app/apis/review.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { formatDate } from '../../../utils/functionUtils';
import CreateReviewModal from '../movie-details/components/CreateReviewModal';
import ModalTrailer from '../movie-details/components/ModalTrailer';
import UpdateReviewModal from '../movie-details/components/UpdateReviewModal';
import VideoPlayer from './components/VideoPlayer';

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

function MovieStreaming() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tap = searchParams.get('tap') || 1;
  const { movieId, movieSlug } = useParams();
  const { isAuthenticated, auth } = useSelector(state => state.auth);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModalTrailer, setShowModalTrailer] = useState(false);
  const [showModalCreateReview, setShowModalCreateReview] = useState(false);
  const [showModalUpdateReview, setShowModalUpdateReview] = useState(false);
  const [currentPageReview, setCurrentPageReview] = useState(1);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [reviewSelected, setReviewSelected] = useState(null);
  const screenRef = useRef(null);

  const {
    data: movie,
    isLoading: isLoadingGetMovie,
    isError: isErrorGetMovie
  } = useGetMovieDetailQuery({
    movieId,
    movieSlug,
    accessType: "FREE"
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
    if (shouldRefetch) {
      refetchReview();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, currentPageReview]);

  if (isLoadingGetMovie || isLoadingGetEpisodes || isLoadingRelatedMovies || isLoadingGetReviews || isLoadingCheckMovieInFavorite || isLoadingCurrentEpisode) {
    return <Loading />
  }

  if (isErrorGetMovie || isErrorGetEpisodes || isErrorRelatedMovies || isErrorGetReviews || isErrorCheckMovieInFavorite || isErrorCurrentEpisode) {
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

  const handleScrollToScreen = () => {
    screenRef.current.scrollIntoView({ behavior: 'smooth' });
  };

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
                {movie.type == 'PHIM_BO' && (
                  <Link to={"/phim-le"} className="text-primary">Phim lẻ</Link>
                )}
                {movie.type == 'PHIM_LE' && (
                  <Link to={"/phim-bo"} className="text-primary">Phim bộ</Link>
                )}
                {movie.type == 'PHIM_CHIEU_RAP' && (
                  <Link to={"/phim-chieu-rap"} className="text-primary">Phim chiếu rạp</Link>
                )}
              </li>
              <li className="breadcrumb-item">
                <Link to={`/phim/${movie.id}/${movie.slug}`} className="text-primary">{movie.title}</Link>
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

      <section className="py-4">
        <div className="container">
          <div className="row">
            <div className="col-3">
              <div className="movie-poster overflow-hidden position-relative rounded">
                <img
                  id="movie-poster"
                  className="w-100"
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
              <div className="d-flex align-items-center mb-3">
                <h4 className="mb-0">{movie.title}</h4>
                {movie.rating && (
                  <div className="d-flex align-items-center bg-body-tertiary p-1 rounded ms-2">
                    <span className="fw-bold me-1">{movie.rating}</span>
                    <span className="rating-icon text-yellow-300"><i className="fa-solid fa-star"></i></span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-body-tertiary">
                <div className="row">
                  <div className="col-2">
                    <p>Thể loại</p>
                  </div>
                  <div className="col-10">
                    <p>
                      {movie.genres.map((genre, index) => (
                        <span key={index}>{genre.name}{index < movie.genres.length - 1 ? ', ' : ''}</span>
                      ))}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <p>Năm sản xuất</p>
                  </div>
                  <div className="col-10">
                    <p>{movie.releaseYear}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <p>Quốc gia</p>
                  </div>
                  <div className="col-10">
                    <p>{movie.country.name}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <p>Đạo diễn</p>
                  </div>
                  <div className="col-10">
                    <p>
                      {movie.directors.map((director, index) => (
                        <span key={index}>{director.name}{index < movie.directors.length - 1 ? ', ' : ''}</span>
                      ))}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <p>Diễn viên</p>
                  </div>
                  <div className="col-10">
                    <p>
                      {movie.actors.map((actor, index) => (
                        <span key={index}>{actor.name}{index < movie.actors.length - 1 ? ', ' : ''}</span>
                      ))}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <p>Nội dung phim</p>
                  </div>
                  <div className="col-10">
                    <p>
                      {movie.description}&nbsp;
                      <span className="text-primary">Xem thêm</span></p>
                  </div>
                </div>
              </div>
              {episodes?.length > 0 && (
                <div>
                  <div className="d-flex align-items-center">
                    <div id="btn-wishlist-container">
                      {isAuthenticated && isFavorite && (
                        <button
                          className="d-inline-block btn bg-dark px-5 py-2 mt-3 rounded text-white"
                          onClick={() => handleDeleteFromFavorite(movie.id)}
                        >
                          <span className="me-1"><i className="fa-solid fa-trash-can"></i></span>Loại khỏi yêu thích
                        </button>
                      )}
                      {isAuthenticated && !isFavorite && (
                        <button
                          className="d-inline-block btn bg-dark px-5 py-2 mt-3 rounded text-white"
                          onClick={() => handleAddToFavorite(movie.id)}
                        >
                          <span className="me-1"><i className="fa-solid fa-heart"></i></span>Thêm vào yêu thích
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {movie.type == 'PHIM_BO' && (
            <div className="mt-4">
              <h4 className="mb-3">Tập phim</h4>
              {episodes?.map((episode) => (
                <Link
                  key={episode.id}
                  onClick={handleScrollToScreen}
                  to={`/xem-phim/${movie.id}/${movie.slug}?tap=${episode.displayOrder}`}
                  className={`btn me-2 ${currentEpisode.displayOrder == episode.displayOrder ? 'btn-danger disabled' : 'btn-dark'}`}
                >
                  {episode.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-4 bg-body-tertiary">
        <div className="container">
          <h4 className="mb-3">Phim đề xuất</h4>
          <div className="row">
            {relatedMovies?.map((movie) => (
              <div key={movie.id} className="col-2">
                <div className="movie-item">
                  <Link to={`/phim/${movie.id}/${movie.slug}`} className="movie-media">
                    <div className="movie-poster rounded overflow-hidden">
                      <img
                        className="w-100 h-100"
                        src={movie.poster}
                        alt={movie.title}
                      />
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
          <div>
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
                Vui lòng
                <a href="/dang-nhap" className="text-primary text-decoration-underline"> đăng nhập </a>
                để viết bình luận</p>
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
        </div>
      </section>

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

export default MovieStreaming