import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useGetGenreBySlugQuery, useGetMoviesByGenreQuery } from '../../../app/apis/genre.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { parseMovieType } from '../../../utils/movieUtils';
import { Helmet } from 'react-helmet';

function TheLoai() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { genreSlug } = useParams();
  let page = searchParams.get('page') || 1;
  let limit = searchParams.get('limit') || 18;
  const {
    data,
    isLoading: isLoadingMovies,
    isError: isErrorMovies
  } = useGetMoviesByGenreQuery({
    slug: genreSlug,
    page: page,
    limit: limit
  }, { refetchOnMountOrArgChange: true })
  const {
    data: genre,
    isLoading: isLoadingGenre,
    isError: isErrorGenre
  } = useGetGenreBySlugQuery(genreSlug);

  if (isLoadingMovies || isLoadingGenre) {
    return <Loading />
  }

  if (isErrorMovies || isErrorGenre) {
    return <ErrorPage />
  }

  const handlePageChange = (page) => {
    setSearchParams({ page: page });
  }


  const currentPage = data?.number + 1;
  return (
    <>
      <Helmet>
        <title>Thể loại: {genre?.name}</title>
      </Helmet>

      <section className="py-4">
        <div className="container">
          <h3 className="mb-3">Thể loại : {genre?.name}</h3>
          <div className="row">
            {data.totalElements > 0 && data?.content.map(movie => (
              <div key={movie.id} className="col-2">
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
              </div>
            ))}
            {data?.totalElements == 0 && (
              <div className="col-12">
                <p className="fst-italic">Không có phim thuộc thể loại này</p>
              </div>
            )}
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

export default TheLoai