import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDeleteFavoriteMutation, useGetFavoritesByCurrentUserQuery } from '../../../app/apis/favorite.api';
import Loading from '../../../components/loading/Loading';
import ErrorPage from '../../../components/error/ErrorPage';

function Favorite() {
  const [searchParams, setSearchParams] = useSearchParams();
  let page = searchParams.get('page') || 1;
  let limit = searchParams.get('limit') || 12;
  const { data, isLoading, isError } = useGetFavoritesByCurrentUserQuery({
    page: page,
    limit: limit
  }, { refetchOnMountOrArgChange: true })

  const [deleteFavorite] = useDeleteFavoriteMutation();

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <ErrorPage />
  }

  const handlePageChange = (page) => {
    setSearchParams({ page: page });
  }

  const currentPage = data?.number + 1;

  const handleDeleteFavorite = (movieId) => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa phim này khỏi danh sách yêu thích?");
    if (isConfirm) {
      deleteFavorite(movieId)
        .unwrap()
        .then(() => {
          toast.success('Xóa phim khỏi danh sách yêu thích thành công');
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message)
        })
    }
  }

  return (
    <>
      <Helmet>
        <title>Danh sách phim yêu thích</title>
      </Helmet>

      <section className="py-4">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={"/"} className="text-primary">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Phim yêu thích
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="pb-4">
        <div className="container">
          <h3 className="mb-3">Danh sách phim yêu thích</h3>
          <div className="row">
            {data?.totalElements === 0 && (
              <p className="fst-italic text-muted mb-0 fs-6">Bạn chưa xem phim nào</p>
            )}
            {data?.totalElements > 0 && data?.content?.map((favorite) => (
              <div key={favorite.id} className="col-3">
                <div className="movie-item mb-4">
                  <span
                    style={{ cursor: 'pointer' }}
                    className="btn-remove-favorite"
                    onClick={() => handleDeleteFavorite(favorite.movie.id)}>
                    <i className="fa-solid fa-xmark"></i>
                  </span>
                  <Link
                    to={`${favorite.movie.accessType === "PAID" ? `/cua-hang/phim/${favorite.movie.id}/${favorite.movie.slug}` : `/phim/${favorite.movie.id}/${favorite.movie.slug}`}`}
                    className="movie-media">
                    <div className="movie-poster rounded overflow-hidden position-relative">
                      <img
                        className="w-100 h-100"
                        src={favorite.movie.poster}
                        alt={favorite.movie.title}
                      />
                      {favorite.movie.type === "PHIM_BO" && (
                        <span
                          style={{ left: `${favorite.movie.accessType === "PAID" ? '74px' : '0'}` }}
                          className="position-absolute badge text-bg-warning top-0 rounded-1"
                        >Phim bộ</span>
                      )}
                      {favorite.movie.accessType === "PAID" && (
                        <span className="position-absolute badge text-bg-danger top-0 start-0 rounded-1">Premium</span>
                      )}
                    </div>
                    <p className="mt-2 truncate-1">{favorite.movie.title}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div id="movie-pagination" className="d-flex justify-content-center align-items-center">
            {data?.totalPages > 1 && (
              <Pagination
                current={currentPage}
                total={data.totalElements}
                pageSize={data.size}
                onChange={handlePageChange}
                className='text-center'
                hideOnSinglePage={true}
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Favorite