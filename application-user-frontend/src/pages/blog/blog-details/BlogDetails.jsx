import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { useGetBlogDetailQuery, useGetLatestBlogsQuery } from '../../../app/apis/blog.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { formatDate } from '../../../utils/functionUtils';
import TableOfContents from '../components/toc/TableOfContents';

function BlogDetails() {
    const { blogId, blogSlug } = useParams();
    const {
        data: blog,
        isLoading: isLoadingGetBlog,
        isError: isErrorGetBlog
    } = useGetBlogDetailQuery({ blogId, blogSlug });

    const {
        data: latestBlogs,
        isLoading: isLoadingGetLatestBlogs,
        isError: isErrorGetLatestBlogs
    } = useGetLatestBlogsQuery({ limit: 6 });

    if (isLoadingGetBlog || isLoadingGetLatestBlogs) {
        return <Loading />
    }

    if (isErrorGetBlog || isErrorGetLatestBlogs) {
        return <ErrorPage />
    }

    return (
        <>
            <Helmet>
                <title>{blog.title}</title>
            </Helmet>

            <section className="py-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link to={"/"} className="text-primary">Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={"/tin-tuc"} className="text-primary">Tin tức</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                {blog.title}
                            </li>
                        </ol>
                    </nav>
                </div>
            </section>

            <section className="pb-4">
                <div className="container">
                    <div className="row h-100 position-relative">
                        <div className="col-8">
                            <h3 className="mb-3">{blog.title}</h3>
                            <p className="fst-italic">{formatDate(blog.publishedAt)}</p>
                            <div
                                className="blog-detail"
                                id="blog-detail"
                                dangerouslySetInnerHTML={{ __html: blog.content }}>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="position-sticky" style={{ top: "1.5rem" }}>
                                <div className="row">
                                    <div className="col-12 mb-4">
                                        <h4 className="mb-3">Mục lục</h4>
                                        <TableOfContents />
                                    </div>
                                </div>
                                <div className="row">
                                    <h4 className="mb-3">Bài viết mới nhất</h4>
                                    {latestBlogs?.map((blog) => (
                                        <div key={blog.id} className="col-12">
                                            <div className="blog-suggest d-flex py-3 border-bottom">
                                                <div className="me-3 blog-thumbnail">
                                                    <Link to={`/tin-tuc/${blog.id}/${blog.slug}`}>
                                                        <img
                                                            className="rounded"
                                                            src={blog.thumbnail}
                                                            alt={blog.title} />
                                                    </Link>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-gray-800 fw-semibold text-semi">
                                                        <Link
                                                            to={`/tin-tuc/${blog.id}/${blog.slug}`}
                                                            className="text-gray-800 fw-semibold text-semi"
                                                        >
                                                            {blog.title}
                                                        </Link>
                                                    </p>
                                                    <p className="mb-1 text-small text-gray-500">{formatDate(blog.publishedAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default BlogDetails