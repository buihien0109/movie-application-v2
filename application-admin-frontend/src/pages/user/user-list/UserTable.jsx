import { Avatar, Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { API_DOMAIN } from "../../../data/constants";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatDate } from "../../../utils/functionUtils";

const UserTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();

    const columns = [
        {
            title: "Avatar",
            dataIndex: "avatar",
            key: "avatar",
            render: (text, record, index) => {
                const imageUrl = text.startsWith("/api") ? `${API_DOMAIN}${text}` : text;
                return <Avatar size={64} src={<img src={imageUrl} alt="avatar" />} />;
            },
        },
        {
            title: "Họ tên",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.localeCompare(b.name, 'vi'),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/users/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps('email'),
            sorter: (a, b) => a.email.localeCompare(b.email, 'vi'),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            ...getColumnSearchProps('phone'),
            render: (text, record, index) => {
                return text ? text : <Tag color="warning">Chưa cập nhật</Tag>;
            },
        },
        {
            title: "Quyền",
            dataIndex: "role",
            key: "role",
            sorter: (a, b) => a.role.localeCompare(b.role, 'vi'),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return (
                    <Tag color={record.role == "ADMIN" ? "geekblue" : "volcano"}>
                        {text.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "enabled",
            key: "enabled",
            sorter: (a, b) => a.enabled - b.enabled,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return text ? <Tag color="success">Kích hoạt</Tag> : <Tag color="warning">Chưa kích hoạt</Tag>;
            },
        },
        {
            title: "Ngày tạo",
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
export default UserTable;
