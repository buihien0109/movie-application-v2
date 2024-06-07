import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { useGetOrdersByCurrentUserQuery } from '../../../app/apis/order.api'
import ErrorPage from '../../../components/error/ErrorPage'
import Loading from '../../../components/loading/Loading'
import { formatCurrency, formatDate } from '../../../utils/functionUtils'

const parseOrderStatus = (status) => {
  switch (status) {
    case 'PENDING':
      return <span className="badge text-bg-warning fw-normal text-white">Chờ xử lý</span>
    case 'SUCCESS':
      return <span className="badge text-bg-success fw-normal">Thành công</span>
    case 'CANCEL':
      return <span className="badge text-bg-secondary fw-normal">Đã hủy</span>
    default:
      return <span className="badge text-bg-primary fw-normal">Không xác định</span>
  }
}

const parsePaymentMethod = (paymentMethod) => {
  switch (paymentMethod) {
    case 'MOMO':
      return <span className="badge text-bg-primary fw-normal">Momo</span>
    case 'ZALO_PAY':
      return <span className="badge text-bg-success fw-normal">ZaloPay</span>
    case 'VN_PAY':
      return <span className="badge text-bg-warning fw-normal text-white">VNPay</span>
    case 'BANK_TRANSFER':
      return <span className="badge text-bg-info fw-normal text-white">Chuyển khoản ngân hàng</span>
    default:
      return <span className="badge text-bg-secondary fw-normal">Không xác định</span>
  }
}

function OrderHistory() {
  const { data, isLoading, isError } = useGetOrdersByCurrentUserQuery()

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <ErrorPage />
  }
  return (
    <>
      <Helmet>
        <title>Lịch sử giao dịch</title>
      </Helmet>

      <section className="py-4">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={"/"} className="text-primary">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Lịch sử giao dịch
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="pb-4">
        <div className="container">
          <h3 className="mb-3">Lịch sử giao dịch</h3>
          <div className="row">
            <div className="col-12">
              <table id="order-history-table">
                <thead>
                  <tr>
                    <th>Ngày giao dịch</th>
                    <th>Phim</th>
                    <th>Số tiền</th>
                    <th>Hình thức thanh toán</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((order) => (
                    <tr key={order.id}>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <Link to={`/cua-hang/phim/${order.movie.id}/${order.movie.slug}`} className="text-primary">
                          <span>{order.movie.title}</span>
                        </Link>
                      </td>
                      <td>{formatCurrency(order.amount)}đ</td>
                      <td>
                        {parsePaymentMethod(order.paymentMethod)}
                      </td>
                      <td>
                        {parseOrderStatus(order.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default OrderHistory