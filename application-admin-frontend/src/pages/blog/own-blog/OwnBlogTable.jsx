import { Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatDate } from "../../../utils/functionUtils";

const OwnBlogTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();

    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            ...getColumnSearchProps('title'),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/blogs/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Lượt xem",
            dataIndex: "viewHistories",
            key: "viewHistories",
            sorter: (a, b) => a.viewHistories.length - b.viewHistories.length,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return text.length;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status - b.status,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return text ? <Tag color="success">Công khai</Tag> : <Tag color="warning">Nháp</Tag>;;
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

    const parseBlogType = (text) => {
        const blogTypeObj = {
            PHIM_CHIEU_RAP: "Phim chiếu rạp",
            TONG_HOP_PHIM: "Tổng hợp phim",
            PHIM_NEFLIX: "Phim Netflix",
        }
        return blogTypeObj[text];
    }

    return <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />;
}
export default OwnBlogTable;
