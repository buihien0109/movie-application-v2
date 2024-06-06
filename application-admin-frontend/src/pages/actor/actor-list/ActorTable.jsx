import { Table } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatDate } from "../../../utils/functionUtils";
import { API_DOMAIN } from "../../../data/constants";
import { Avatar } from "antd";

const ActorTable = ({ data }) => {
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
            title: "Tên",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps('name'),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/actors/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Ngày sinh",
            dataIndex: "birthday",
            key: "birthday",
            render: (text, record, index) => {
                return formatDate(text);
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
export default ActorTable;
