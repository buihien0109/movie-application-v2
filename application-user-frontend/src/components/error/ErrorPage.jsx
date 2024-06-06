import React from 'react'

function ErrorPage() {
    return (
        <>
            <section className="page_404">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-8">
                            <div className="text-center">
                                <div className="four_zero_four_bg">
                                    <h1 className="text-center">404</h1>
                                </div>

                                <div className="contant_box_404">
                                    <h4>
                                        Có vẻ như bạn đã bị lạc
                                    </h4>

                                    <p className="text-muted">Trang bạn đang tìm kiếm không tồn tại!</p>

                                    <a href="https://instagram.com/abol.codes" className="btn btn-primary">Về trang chủ</a>
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