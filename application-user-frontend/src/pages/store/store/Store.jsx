import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetMoviesByAccessTypeQuery } from '../../../app/apis/movie.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { formatCurrency } from '../../../utils/functionUtils';

function Store() {
    const [searchParams, setSearchParams] = useSearchParams();
    let page = searchParams.get('page') || 1;
    let limit = searchParams.get('limit') || 18;
    const { data, isLoading, isError } = useGetMoviesByAccessTypeQuery({
        accessType: 'PAID',
        page: page,
        limit: limit
    }, { refetchOnMountOrArgChange: true })

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

    return (
        <>
            <Helmet>
                <title>Danh sách phim</title>
            </Helmet>
            <section className="py-4">
                <div className="container">
                    <h3 className="mb-3">Danh sách phim</h3>
                    <div className="row">
                        {data?.content?.map((movie) => (
                            <div key={movie.id} className="col-2">
                                <div className="movie-item mb-4">
                                    <Link to={`/cua-hang/phim/${movie.id}/${movie.slug}`} className="movie-media">
                                        <div className="movie-poster rounded overflow-hidden position-relative">
                                            <img
                                                className="w-100 h-100"
                                                src={movie.poster}
                                                alt={movie.title}
                                            />
                                            {movie.type == "PHIM_BO" && (
                                                <span className="position-absolute badge text-bg-danger top-0 start-0 rounded-1">Phim bộ</span>
                                            )}
                                        </div>
                                        <p className="mt-2 mb-1 truncate-1">{movie.title}</p>
                                        <div className="d-flex align-items-center text-muted" style={{ fontSize: 14 }}>
                                            {movie.rating && (
                                                <span className="me-2">
                                                    <span className="fw-medium">{movie.rating}</span>
                                                    <span style={{ color: "#EDBB0E" }}><i className="fa fa-star"></i></span>
                                                </span>
                                            )}
                                            <span className="fw-medium">{formatCurrency(movie.price)}đ</span>
                                        </div>
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

                    {/* {data?.totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4" id="pagination">
                            <nav aria-label="...">
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage == 1 ? 'disabled' : ''}`}>
                                        <Link to={`/cua-hang?page=${currentPage - 1}`} className="page-link">
                                            <i className="fa-solid fa-caret-left"></i>
                                        </Link>
                                    </li>
                                    {Array.from({ length: data?.totalPages }, (_, index) => (
                                        <li key={index} className={`page-item ${currentPage == index + 1 ? 'active' : ''}`}>
                                            <Link to={`/cua-hang?page=${index + 1}`} className="page-link">{index + 1}</Link>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage == data?.totalPages ? 'disabled' : ''}`}>
                                        <Link to={`/cua-hang?page=${currentPage + 1}`} className="page-link">
                                            <i className="fa-solid fa-caret-right"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )} */}
                </div>
            </section>
        </>
    )
}

export default Store