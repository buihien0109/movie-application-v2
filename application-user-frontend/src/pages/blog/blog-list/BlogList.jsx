import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetBlogsQuery } from '../../../app/apis/blog.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { formatDate } from '../../../utils/functionUtils';

function BlogList() {
    const [searchParams, setSearchParams] = useSearchParams();
    let page = searchParams.get('page') || 1;
    let limit = searchParams.get('limit') || 10;
    const { data, isLoading, isError } = useGetBlogsQuery({
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
                <title>Danh sách tin tức</title>
            </Helmet>

            <section className="py-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to={"/"} className="text-primary">Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Tin tức
                            </li>
                        </ol>
                    </nav>
                    <h3 className="mb-3">Tin tức</h3>
                    <div className="row">
                        {data?.content?.map((blog) => (
                            <div key={blog.id} className="col-6">
                                <div className="blog-item bg-body-tertiary rounded mb-4 overflow-hidden">
                                    <Link to={`/tin-tuc/${blog.id}/${blog.slug}`} className="d-flex">
                                        <div className="blog-thumbnail">
                                            <img src={blog.thumbnail} alt={blog.title} />
                                        </div>
                                        <div className="blog-info p-3">
                                            <h5 className="truncate-1-heading">{blog.title}</h5>
                                            <p className="fst-italic" style={{ fontSize: 14 }}>{formatDate(blog.publishedAt)}</p>
                                            <p className="mb-0 truncate">{blog.description}</p>
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
                </div>
            </section>
        </>
    )
}

export default BlogList