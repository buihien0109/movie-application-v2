import { Table, Tag } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/functionUtils';

const parseMovieType = (type) => {
    switch (type) {
        case "PHIM_LE":
            return <Tag color="success">Phim lẻ</Tag>;
        case "PHIM_BO":
            return <Tag color="warning">Phim bộ</Tag>;
        case "PHIM_CHIEU_RAP":
            return <Tag color="blue">Phim chiếu rạp</Tag>;
        default:
            return <Tag color="default">Không xác định</Tag>;
    }
}

function MovieTable({ movie }) {
    const columns = [
        {
            title: "Phim",
            dataIndex: "title",
            key: "title",
            width: "30%",
            render: (text, record, index) => {
                return (
                    <Link to={`/admin/movies/${record.id}/detail`}>
                        {text}
                    </Link>
                )
            },
        },
        {
            title: "Loại phim",
            dataIndex: "type",
            key: "type",
            width: "20%",
            render: (text, record, index) => {
                return parseMovieType(text);
            },
        },
        {
            title: "Giá tiền",
            dataIndex: "price",
            key: "price",
            width: "20%",
            render: (text, record, index) => {
                return formatCurrency(text)
            },
        },
        {
            title: "Thành tiền",
            dataIndex: "price",
            key: "price",
            width: "30%",
            render: (text, record, index) => {
                return formatCurrency(text)
            },
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={[movie]}
            rowKey={(record) => record.id}
            pagination={false}
            style={{ marginTop: "2rem" }}
        />
    );
}

export default MovieTable