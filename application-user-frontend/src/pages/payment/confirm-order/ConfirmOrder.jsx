import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../../app/apis/order.api';
import ErrorPage from '../../../components/error/ErrorPage';
import { IconFail, IconSuccess, IconWaiting } from '../../../components/icon/Icon';
import Loading from '../../../components/loading/Loading';
import { formatCurrency } from '../../../utils/functionUtils';

const getOrderMessage = (order) => {
  const messages = [
    {
      status: "SUCCESS",
      icon: <IconSuccess />,
      title: "Thanh toán thành công!",
      content: `Cảm ơn bạn đã thanh toán thành công đơn hàng #${order.id}`
    },
    {
      status: "CANCEL",
      icon: <IconFail />,
      title: "Đơn hàng đã bị hủy!",
      content: `Đơn hàng #${order.id} đã bị hủy`
    },
    {
      status: "PENDING",
      icon: <IconWaiting />,
      title: "Đang chờ xử lý!",
      content: `Đơn hàng #${order.id} đang chờ xử lý`
    }
  ]
  return messages.find(message => message.status === order.status);
}

function ConfirmOrder() {
  const { orderId } = useParams();
  const { data: order, isLoading, isError, error } = useGetOrderByIdQuery(orderId);

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <ErrorPage />
  }

  if (order?.paymentMethod !== "BANK_TRANSFER") {
    return <ErrorPage />
  }


  const message = getOrderMessage(order);
  return (
    <>
      <Helmet>
        <title>Xác nhận đơn hàng</title>
      </Helmet>

      <section className="py-4">
        <div className="container">
          <div className="d-flex flex-column justify-content-center">
            {message.icon}
            <div className="text-center">
              <h3>{message.title}</h3>
              <p className="my-2">{message.content}</p>
            </div>
          </div>

          <div className="row justify-content-center mt-4">
            <div className="col-md-4">
              <div className="movie-item">
                <div className="movie-poster rounded overflow-hidden">
                  <img
                    src={order.movie.poster}
                    alt={order.movie.title}
                    className="img-fluid"
                  />
                </div>
                <p className="my-2">{order.movie.title}</p>
                <h5 className="fw-medium text-danger">{formatCurrency(order.amount)}đ</h5>
                {order.status === "SUCCESS" && (
                  <Link
                    to={`/store/xem-phim/${order.movie.id}/${order.movie.slug}?tap=${order.movie.type == 'PHIM_BO' ? 1 : 'full'}`}
                    className="d-block btn btn-danger px-5 py-2 mt-3 rounded me-2"
                  >
                    <span className="me-2"><i className="fa-solid fa-play"></i></span>
                    Xem phim
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ConfirmOrder