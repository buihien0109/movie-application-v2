import { Table } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const columns = [
    {
        title: "Họ tên",
        dataIndex: "name",
        key: "name",
        render: (text, record, index) => {
            return (
                <RouterLink to={`/admin/users/${record?.id}/detail`}>
                    {text}
                </RouterLink>
            );
        },
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (text, record, index) => {
            return text;
        },
    },
    {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        render: (text, record, index) => {
            return text;
        },
    },
];

function TableLatestUser({ data }) {
    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record?.id}
            pagination={{ pageSize: 5, hideOnSinglePage: true }}
        />
    );
}

export default TableLatestUser;
