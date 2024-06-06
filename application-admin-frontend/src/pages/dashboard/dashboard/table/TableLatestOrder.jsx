import { Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatCurrency } from "../../../../utils/functionUtils";

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
        case "VNPAY":
            return <Tag color="success">VNPAY</Tag>;
        case "BANK_TRANSFER":
            return <Tag color="blue">Chuyển khoản ngân hàng</Tag>;
        default:
            return <Tag color="default">Không xác định</Tag>;
    }
}

const columns = [
    {
        title: "Order ID",
        dataIndex: "id",
        key: "id",
        render: (text, record, index) => {
            return (
                <RouterLink to={`/admin/orders/${record.id}/detail`}>
                    {text}
                </RouterLink>
            );
        },
    },
    {
        title: "Phim",
        dataIndex: "movie",
        key: "title",
        render: (text, record, index) => {
            return (
                <RouterLink to={`/admin/movies/${text.id}/detail`}>
                    {text.title}
                </RouterLink>
            )
        },
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (text, record, index) => {
            return parseOrderStatus(text);
        },
    },
    {
        title: "Hình thức thanh toán",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
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
];

function TableLatestOrder({ data }) {
    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
            pagination={{ pageSize: 5, hideOnSinglePage: true }}
        />
    );
}

export default TableLatestOrder;
