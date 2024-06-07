import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useGetCountryBySlugQuery, useGetMoviesByCountryQuery } from '../../../app/apis/country.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { parseMovieType } from '../../../utils/movieUtils';
import { Helmet } from 'react-helmet';

function QuocGia() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { countrySlug } = useParams();
    let page = searchParams.get('page') || 1;
    let limit = searchParams.get('limit') || 18;
    const {
        data,
        isLoading: isLoadingMovies,
        isError: isErrorMovies
    } = useGetMoviesByCountryQuery({
        slug: countrySlug,
        page: page,
        limit: limit
    }, { refetchOnMountOrArgChange: true })
    const {
        data: country,
        isLoading: isLoadingCountry,
        isError: isErrorCountry
    } = useGetCountryBySlugQuery(countrySlug);

    if (isLoadingMovies || isLoadingCountry) {
        return <Loading />
    }

    if (isErrorMovies || isErrorCountry) {
        return <ErrorPage />
    }

    const handlePageChange = (page) => {
        setSearchParams({ page: page });
    }

    const currentPage = data?.number + 1;
    return (
        <>
            <Helmet>
                <title>Quốc gia: {country?.name}</title>
            </Helmet>
            <section className="py-4">
                <div className="container">
                    <h3 className="mb-3">Quốc gia : {country?.name}</h3>
                    <div className="row">
                        {data?.totalElements > 0 && data?.content.map(movie => (
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
                                <p className="fst-italic">Không có phim thuộc quốc gia này</p>
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

export default QuocGia