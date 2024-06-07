import { Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatCurrency, formatDate } from "../../../utils/functionUtils";

const parseOrderStatus = (status) => {
    switch (status) {
        case "PENDING":
            return <Tag color="warning">Chờ thanh toán</Tag>;
        case "SUCCESS":
            return <Tag color="success">Đã thanh toán</Tag>;
        case "CANCEL":
            return <Tag color="red">Đã hủy</Tag>;
        default:
            return <Tag color="default">Không xác định</Tag>;
    }
}

const parsePaymentMethod = (method) => {
    switch (method) {
        case "MOMO":
            return <Tag color="warning">MOMO</Tag>;
        case "VN_PAY":
            return <Tag color="success">VNPAY</Tag>;
        case "ZALO_PAY":
            return <Tag color="blue">ZALO PAY</Tag>;
        case "BANK_TRANSFER":
            return <Tag color="volcano">Chuyển khoản ngân hàng</Tag>;
        default:
            return <Tag color="default">Không xác định</Tag>;
    }
}

const OrderTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();
    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            key: "id",
            ...getColumnSearchProps('id'),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/orders/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Họ tên",
            dataIndex: "user",
            key: "user",
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/users/${text.id}/detail`}>
                        {text.name}
                    </RouterLink>
                );
            },
        },
        {
            title: "Tên phim",
            dataIndex: "movie",
            key: "movie",
            ...getColumnSearchProps('movie', ['title']),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/movies/${text.id}/detail`}>
                        {text.title}
                    </RouterLink>
                );
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status.localeCompare(b.status, 'vi'),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return parseOrderStatus(text);
            },
        },
        {
            title: "Hình thức thanh toán",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            sorter: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod, 'vi'),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return parsePaymentMethod(text);
            },
        },
        {
            title: "Tổng tiền",
            dataIndex: "amount",
            key: "amount",
            render: (text, record, index) => {
                return formatCurrency(text);
            },
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return formatDate(text);
            },
        },
    ];

    return <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />;
}
export default OrderTable;
