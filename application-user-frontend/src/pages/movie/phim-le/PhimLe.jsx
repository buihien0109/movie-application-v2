import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetMoviesByTypeQuery } from '../../../app/apis/movie.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';

function PhimLe() {
  const [searchParams, setSearchParams] = useSearchParams();
  let page = searchParams.get('page') || 1;
  let limit = searchParams.get('limit') || 18;
  const { data, isLoading, isError, error } = useGetMoviesByTypeQuery({
    type: 'PHIM_LE',
    page: page,
    limit: limit
  }, { refetchOnMountOrArgChange: true })

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <ErrorPage error={error} />
  }

  const handlePageChange = (page) => {
    setSearchParams({ page: page });
  }

  const currentPage = data?.number + 1;

  return (
    <>
      <Helmet>
        <title>Danh sách phim lẻ</title>
      </Helmet>

      <section className="py-4">
        <div className="container">
          <h3 className="mb-3">Danh sách phim lẻ</h3>
          <div className="row">
            {data?.content?.map((movie) => (
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

export default PhimLe