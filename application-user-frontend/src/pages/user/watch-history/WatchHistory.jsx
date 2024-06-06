import moment from 'moment'
import 'moment/locale/vi'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDeleteAllHistoryMovieMutation, useDeleteHistoryMovieMutation, useGetHistoryMoviesByCurrentUserQuery } from '../../../app/apis/history.api'
import ErrorPage from '../../../components/error/ErrorPage'
import Loading from '../../../components/loading/Loading'

// TODO: Chưa set được ngôn ngữ cho moment
moment.locale('vi')
function WatchHistory() {
  const { data, isLoading, isError } = useGetHistoryMoviesByCurrentUserQuery(undefined, { refetchOnMountOrArgChange: true })
  const [deleteHistoryMovie] = useDeleteHistoryMovieMutation();
  const [deleteAllHistoryMovie] = useDeleteAllHistoryMovieMutation();

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <ErrorPage />
  }

  const handleDeleteHistory = (id) => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa lịch sử xem phim này?");
    if (isConfirm) {
      deleteHistoryMovie(id)
        .unwrap()
        .then(() => {
          toast.success('Xóa lịch sử xem phim thành công');
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message)
        })
    }
  }

  const handleDeleteAllHistory = () => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa tất cả lịch sử xem phim?");
    if (isConfirm) {
      deleteAllHistoryMovie()
        .unwrap()
        .then(() => {
          toast.success('Xóa tất cả lịch sử xem phim thành công');
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
        <title>Lịch sử xem phim</title>
      </Helmet>

      <section className="py-4">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={"/"} className="text-primary">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Lịch sử xem phim
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="pb-4">
        <div className="container">
          <div className="d-flex justify-content-between">
            <h3 className="mb-3">Lịch sử xem phim</h3>
            {data?.length > 0 && (
              <span
                style={{ cursor: 'pointer' }}
                onClick={handleDeleteAllHistory}
                className="text-primary"
                id="btn-delete-all">
                Xóa tất cả lịch sử</span>
            )}
          </div>
          <div className="row watch-history-list">
            {data?.length === 0 && (
              <p className="fst-italic text-muted mb-0 fs-6">Bạn chưa xem phim nào</p>
            )}
            {data?.length > 0 && data?.map((history) => (
              <div key={history.id} className="col-3">
                <div className="movie-item mb-4">
                  <span className="btn-remove-favorite" onClick={() => handleDeleteHistory(history.id)}>
                    <i className="fa-solid fa-xmark"></i>
                  </span>
                  {history.movie.accessType === 'PAID' && (
                    <Link
                      to={`/store/xem-phim/${history.movie.id}/${history.movie.slug}?tap=${history.movie.type == 'PHIM_BO' ? history.episode.displayOrder : 'full'}`}
                      className="movie-media">
                      <div className="movie-poster rounded overflow-hidden position-relative">
                        <img className="w-100 h-100"
                          src={history.movie.poster}
                          alt={history.movie.title} />
                        <div className="progress position-absolute left-0 bottom-0 rounded-0 w-100"
                          style={{ height: 10 }}>
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: `${history.duration * 100 / history.episode.duration}%` }}></div>
                        </div>
                        {history.movie.type === "PHIM_BO" && (
                          <span
                            style={{ left: `${history.movie.accessType === "PAID" ? '74px' : '0'}` }}
                            className="position-absolute badge text-bg-warning top-0 rounded-1"
                          >Phim bộ</span>
                        )}
                        {history.movie.accessType === "PAID" && (
                          <span className="position-absolute badge text-bg-danger top-0 start-0 rounded-1">Premium</span>
                        )}
                      </div>
                      <p className="mt-2 mb-1 d-flex align-items-center">
                        {history.movie.title}
                        {history.movie.type === "PHIM_BO" && (
                          <span className="badge text-bg-primary ms-2">Tập {history.episode.displayOrder}</span>
                        )}
                      </p>
                      <div className="d-flex align-items-center">
                        <p className="text-muted fst-italic" style={{ fontSize: 14 }}>
                          {moment(history.watchTime).fromNow()}
                        </p>
                      </div>
                    </Link>
                  )}
                  {history.movie.accessType === 'FREE' && (
                    <Link
                      to={`/xem-phim/${history.movie.id}/${history.movie.slug}?tap=${history.movie.type == 'PHIM_BO' ? history.episode.displayOrder : 'full'}`}
                      className="movie-media">
                      <div className="movie-poster rounded overflow-hidden position-relative">
                        <img
                          className="w-100 h-100"
                          src={history.movie.poster}
                          alt={history.movie.title} />
                        <div className="progress position-absolute left-0 bottom-0 rounded-0 w-100"
                          style={{ height: 10 }}>
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: `${history.duration * 100 / history.episode.duration}%` }}></div>
                        </div>
                        {history.movie.type === "PHIM_BO" && (
                          <span style={{ left: `${history.movie.accessType === "PAID" ? '74px' : '0'}` }}
                            className="position-absolute badge text-bg-warning top-0 rounded-1">Phim bộ</span>
                        )}
                      </div>
                      <p className="mt-2 mb-1 d-flex align-items-center">
                        {history.movie.title}
                        {history.movie.type === "PHIM_BO" && (
                          <span className="badge text-bg-primary ms-2">Tập {history.episode.displayOrder}</span>
                        )}
                      </p>
                      <div className="d-flex align-items-center">
                        <p className="text-muted fst-italic" style={{ fontSize: 14 }}>
                          {moment(history.watchTime).fromNow()}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default WatchHistory