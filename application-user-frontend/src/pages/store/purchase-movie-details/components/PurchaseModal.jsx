import React, { useState } from 'react';
import { Button, Col, Form, Image, Modal, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import logoBankTransfer from "../../../../../public/bank-transfer.png";
import logoMomo from "../../../../../public/logo-momo.svg";
import logoVNPay from "../../../../../public/logo-vnpay2.png";
import logoZaloPay from "../../../../../public/logo-zalopay.webp";
import { useCreateOrderMutation } from '../../../../app/apis/order.api';
import { formatCurrency } from '../../../../utils/functionUtils';

const PurchaseModal = ({ show, handleClose, movie }) => {
    const [showBankTransferInfo, setShowBankTransferInfo] = useState(true)
    const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER')
    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const handleSubmitOrder = () => {
        if (!paymentMethod) {
            toast.error("Vui lòng chọn hình thức thanh toán")
            return
        }

        createOrder({ movieId: movie.id, paymentMethod })
            .unwrap()
            .then((res) => {
                window.location.href = res.url
            })
            .catch((error) => {
                console.log(error)
                toast.error(error?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau")
            })
    }

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title id="staticBackdropLiveLabel">Mua Phim</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <div className="movie-item">
                            <div className="movie-poster rounded overflow-hidden">
                                <Image src={movie.poster} alt={movie.title} fluid />
                            </div>
                            <p className="my-2">{movie.title}</p>
                            <h5 className="fw-medium text-danger">
                                {formatCurrency(movie.price)}đ
                            </h5>
                        </div>
                    </Col>
                    <Col md={6}>
                        <h5 className="mb-3">Hình thức thanh toán</h5>
                        <ul className="payment-container ps-0">
                            <li className="payment-item">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="radio"
                                        name="payment-method"
                                        id="bank-transfer"
                                        value="BANK_TRANSFER"
                                        className='d-flex align-items-center justify-content-center'
                                        label={
                                            <span>
                                                Chuyển khoản trực tiếp <Image src={logoBankTransfer} alt="logo bank transfer" fluid />
                                            </span>
                                        }
                                        defaultChecked
                                        onClick={() => {
                                            setShowBankTransferInfo(true)
                                            setPaymentMethod('BANK_TRANSFER')
                                        }}
                                    />
                                </div>
                            </li>
                            <li className="payment-item">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="radio"
                                        name="payment-method"
                                        id="vnpay"
                                        value="VN_PAY"
                                        className='d-flex align-items-center justify-content-center'
                                        label={
                                            <span>
                                                Thanh toán bằng VNPay <Image src={logoVNPay} alt="logo vnpay" fluid />
                                            </span>
                                        }
                                        onClick={() => {
                                            setShowBankTransferInfo(false)
                                            setPaymentMethod('VN_PAY')
                                        }}
                                    />
                                </div>
                            </li>
                            <li className="payment-item">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="radio"
                                        name="payment-method"
                                        id="momo"
                                        value="MOMO"
                                        className='d-flex align-items-center justify-content-center'
                                        label={
                                            <span>
                                                Thanh toán bằng Ví MoMo <Image src={logoMomo} alt="logo momo" fluid />
                                            </span>
                                        }
                                        onClick={() => {
                                            setShowBankTransferInfo(false)
                                            setPaymentMethod('MOMO')
                                        }}
                                    />
                                </div>
                            </li>
                            <li className="payment-item">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="radio"
                                        name="payment-method"
                                        id="zalopay"
                                        value="ZALO_PAY"
                                        className='d-flex align-items-center justify-content-center'
                                        label={
                                            <span>
                                                Thanh toán bằng Ví ZaloPay <Image src={logoZaloPay} alt="logo zalopay" fluid />
                                            </span>
                                        }
                                        onClick={() => {
                                            setShowBankTransferInfo(false)
                                            setPaymentMethod('ZALO_PAY')
                                        }}
                                    />
                                </div>
                            </li>
                        </ul>
                        {showBankTransferInfo && (
                            <div className="info-bank-transfer bg-body-tertiary p-2 mb-3">
                                <h5>Thông tin chuyển khoản</h5>
                                <div className="text-small fw-semibold">
                                    <Row className="mb-2">
                                        <Col md={4}>Ngân hàng</Col>
                                        <Col md={8} className="text-gray-500">Vietcombank</Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4}>Số tài khoản</Col>
                                        <Col md={8} className="text-gray-500">02482042829349</Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4}>Chủ tài khoản</Col>
                                        <Col md={8} className="text-gray-500">Nguyễn Văn A</Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col md={4}>Nội dung CK</Col>
                                        <Col md={8} className="text-gray-500">[Họ tên] - [Email] - [Tên phim]</Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <p className="fw-normal fst-italic">
                                            Ví dụ NDCK: Nguyễn Văn A - a@gmail.com - {movie.title}
                                        </p>
                                        <p className="fw-normal fst-italic">
                                            Sau khi chuyển khoản thành công. Hãy bấm vào
                                            "<span className="fw-semibold">Xác nhận đơn hàng</span>"
                                        </p>
                                    </Row>
                                </div>
                            </div>
                        )}
                        <Row>
                            <Col md={12}>
                                <Button
                                    className="d-block w-100 btn btn-success"
                                    id="btn-submit-order"
                                    onClick={handleSubmitOrder}
                                    disabled={isLoading}
                                >
                                    Xác nhận mua hàng
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default PurchaseModal;
