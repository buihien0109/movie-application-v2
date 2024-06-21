import React from 'react'
import { Link } from 'react-router-dom'


const parseStatus = (error) => {
    switch (error?.status) {
        case "INTERNAL_SERVER_ERROR":
            return {
                code: 500,
                title: "Ops! Có lỗi xảy ra",
                message: "Có lỗi xảy ra khi xử lý yêu cầu của bạn",
            }
        case "NOT_FOUND":
            return {
                code: 404,
                title: "Không tìm thấy trang",
                message: "Trang bạn đang tìm kiếm không tồn tại",
            }
        default:
            return {
                code: 500,
                title: "Ops! Có lỗi xảy ra",
                message: "Có lỗi xảy ra khi xử lý yêu cầu của bạn",
            }
    }
}
function ErrorPage({ error }) {
    const { code, title, message } = parseStatus(error)
    return (
        <>
            <section className="page_404">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-8">
                            <div className="text-center">
                                <div className="four_zero_four_bg">
                                    <h1 className="text-center">{code}</h1>
                                </div>

                                <div className="contant_box_404">
                                    <h4>{title}</h4>

                                    <p className="text-muted">{message}</p>

                                    <Link to={"/"} className="btn btn-primary">Về trang chủ</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ErrorPage