import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";
import { useCheckRegisterTokenQuery } from "../../../app/apis/auth.api";
import ErrorPage from "../../../components/error/ErrorPage";
import Loading from "../../../components/loading/Loading";

function ConfirmRegistration() {
    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get('token');
    const {
        data,
        isLoading,
        isError,
        error
    } = useCheckRegisterTokenQuery(token);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorPage />
    }

    return (
        <>
            <Helmet>
                <title>Xác thực tài khoản</title>
            </Helmet>
            <section className="py-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link to={"/"} className="text-primary">Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Xác thực tài khoản</li>
                        </ol>
                    </nav>
                </div>
            </section>
            <section className="pb-4">
                <div className="container">
                    <h4>{data.message}</h4>
                    {data.success && (
                        <>
                            <p className='mt-3 text-sm text-gray-500'>Chào mừng bạn đến với trang web của chúng tôi</p>
                            <Link to={"/dang-nhap"} className="btn btn-primary mt-1">Đăng nhập tài khoản</Link>
                        </>
                    )}

                </div>
            </section>
        </>
    )
}

export default ConfirmRegistration