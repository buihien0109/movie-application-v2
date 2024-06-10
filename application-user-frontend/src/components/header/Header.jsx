import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from "../../../public/logo.png";
import { logout } from '../../app/slices/auth.slice';

function Header() {
    const dispatch = useDispatch();
    const { auth, isAuthenticated } = useSelector(state => state.auth)
    const countries = useSelector(state => state.countries)
    const genres = useSelector(state => state.genres)

    const handleLogout = () => {
        dispatch(logout())
        toast.success("Đăng xuất thành công")
    }
    return (
        <header className="bg-dark header">
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <Link to={"/"} className="navbar-brand">
                        <img src={logo} alt="logo" className="logo" />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#main-menu" aria-controls="main-menu" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between align-items-center" id="main-menu">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink to={"/"} className="nav-link text-white">Trang chủ</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/phim-bo"} className="nav-link text-white">Phim bộ</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/phim-chieu-rap"} className="nav-link text-white">Phim chiếu rạp</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/phim-le"} className="nav-link text-white">Phim lẻ</NavLink>
                            </li>
                            <li className="nav-item dropdown mega-menu">
                                <Link className="nav-link text-white dropdown-toggle" href="#" id="megaMenuCountry" role="button" data-bs-toggle="dropdown" aria-expanded="false">Quốc gia</Link>
                                <div className="dropdown-menu p-0 border-0 shadow rounded-1 bg-body-tertiary" aria-labelledby="megaMenuCountry">
                                    <div style={{ width: 700 }} className="p-3">
                                        <div className="row">
                                            {countries?.map(country => (
                                                <div className="col-3" key={country.id}>
                                                    <NavLink
                                                        to={`/quoc-gia/${country.slug}`}
                                                        className="d-block text-semi text-gray-600 p-2"
                                                    >
                                                        {country.name}
                                                    </NavLink>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item dropdown mega-menu">
                                <Link className="nav-link text-white dropdown-toggle" href="#" id="megaMenuGenre" role="button" data-bs-toggle="dropdown" aria-expanded="false">Thể loại</Link>
                                <div className="dropdown-menu p-0 border-0 shadow rounded-1 bg-body-tertiary" aria-labelledby="megaMenuGenre">
                                    <div style={{ width: 700 }} className="p-3">
                                        <div className="row">
                                            {genres?.map(genre => (
                                                <div className="col-3" key={genre.id}>
                                                    <NavLink
                                                        to={`/the-loai/${genre.slug}`}
                                                        className="d-block text-semi text-gray-600 p-2"
                                                    >
                                                        {genre.name}
                                                    </NavLink>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/cua-hang"} className="nav-link text-white">Mua phim</NavLink>
                            </li>
                        </ul>
                        <div className="user-action">
                            {isAuthenticated
                                ? (
                                    <div className="d-flex align-items-center">
                                        <div className="dropdown ms-3">
                                            <p className="text-white mb-0 dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                {auth?.name}
                                            </p>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                {auth?.role === "ADMIN" && (
                                                    <li>
                                                        <a href="/admin/dashboard" className="dropdown-item text-gray-600 py-2">
                                                            <span style={{ width: 20 }} className="d-inline-block"><i className="fa-solid fa-user-tie"></i></span>
                                                            <span className="ps-1 text-small">Trang quản trị</span>
                                                        </a>
                                                    </li>
                                                )}
                                                <li>
                                                    <NavLink to={"/thong-tin-ca-nhan"} className="dropdown-item text-gray-600 py-2">
                                                        <span style={{ width: 20 }} className="d-inline-block"><i className="fa-regular fa-address-card"></i></span>
                                                        <span className="ps-1 text-small">Thông tin cá nhân</span>
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to={"/lich-su-xem-phim"} className="dropdown-item text-gray-600 py-2">
                                                        <span style={{ width: 20 }} className="d-inline-block"><i className="fa-solid fa-clock-rotate-left"></i></span>
                                                        <span className="ps-1 text-small">Lịch sử xem phim</span>
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to={"/phim-yeu-thich"} className="dropdown-item text-gray-600 py-2">
                                                        <span style={{ width: 20 }} className="d-inline-block"><i className="fa-solid fa-heart"></i></span>
                                                        <span className="ps-1 text-small">Phim yêu thích</span>
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to={"/lich-su-giao-dich"} className="dropdown-item text-gray-600 py-2">
                                                        <span style={{ width: 20 }} className="d-inline-block"><i className="fa-solid fa-cart-shopping"></i></span>
                                                        <span className="ps-1 text-small">Lịch sử giao dịch</span>
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to={"/danh-sach-phim-mua"} className="dropdown-item text-gray-600 py-2">
                                                        <span style={{ width: 20 }} className="d-inline-block"><i className="fa-solid fa-sack-dollar"></i></span>
                                                        <span className="ps-1 text-small">Phim đã mua</span>
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <p
                                                        style={{ cursor: "pointer" }}
                                                        className="dropdown-item text-gray-600 py-2"
                                                        onClick={handleLogout}
                                                    >
                                                        <span style={{ width: 20 }} className="d-inline-block"><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
                                                        <span className="ps-1 text-small">Đăng xuất</span>
                                                    </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )
                                : (
                                    <Link to={"/dang-nhap"} className="text-white">Đăng nhập</Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </header >
    )
}

export default Header