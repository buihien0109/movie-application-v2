import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="bg-dark py-4 text-white">
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <Link to={"/"}>
                            <img src="/public/logo.png" alt="logo" className="logo" />
                        </Link>
                        <p className="mt-2 text-small">Motchill - Xem phim Online Vietsub chất lượng cao miễn phí, nhiều thể loại phim
                            phong phú, đặc sắc, giao diện trực quan, thuận tiện, tốc độ tải nhanh, thường xuyên cập nhật các
                            bộ phim mới.</p>
                    </div>
                    <div className="col-2 text-small">
                        <h6 className="text-uppercase mb-3 fw-normal">Danh mục</h6>
                        <p><Link className="text-white" to={"#"}>Tin tức</Link></p>
                        <p><Link className="text-white" to={"#"}>Phim chiếu rạp</Link></p>
                        <p><Link className="text-white" to={"#"}>Phim bộ</Link></p>
                        <p><Link className="text-white" to={"#"}>Phim lẻ</Link></p>
                        <p><Link className="text-white" to={"#"}>TV Show</Link></p>
                    </div>
                    <div className="col-2 text-small">
                        <h6 className="text-uppercase mb-3 fw-normal">Thể loại</h6>
                        <p><Link className="text-white" to={"#"}>Phim cổ trang</Link></p>
                        <p><Link className="text-white" to={"#"}>Phim đam mỹ</Link></p>
                        <p><Link className="text-white" to={"#"}>Phim bách hợp</Link></p>
                        <p><Link className="text-white" to={"#"}>Phim viễn tưởng</Link></p>
                        <p><Link className="text-white" to={"#"}>Phim hoạt hình</Link></p>
                    </div>
                    <div className="col-2 text-small">
                        <h6 className="text-uppercase mb-3 fw-normal">Điều khoản</h6>
                        <p><Link className="text-white" to={"#"}>DMCA</Link></p>
                        <p><Link className="text-white" to={"#"}>Liên hệ</Link></p>
                        <p><Link className="text-white" to={"#"}>Privacy</Link></p>
                        <p><Link className="text-white" to={"#"}>Terms of Service</Link></p>
                    </div>

                    <div className="col-2">
                        <h6 className="text-uppercase mb-3 fw-normal">SOCIAL</h6>
                        <div className="d-flex">
                            <p className="fs-4 me-3">
                                <Link to={"#"}>
                                    <img src="/public/facebook.png" alt="logo" className="logo-social" />
                                </Link>
                            </p>
                            <p className="fs-4 me-3">
                                <Link to={"#"}>
                                    <img src="/public/twitter.png" alt="logo" className="logo-social" />
                                </Link>
                            </p>
                            <p className="fs-4 me-3">
                                <Link to={"#"}>
                                    <img src="/public/youtube.png" alt="logo" className="logo-social" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer