import { StarOutlined } from "@ant-design/icons";
import { Table, Tag, Typography } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatCurrency, formatDate } from "../../../utils/functionUtils";

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

const parseMovieAccessType = (type) => {
  switch (type) {
    case "FREE":
      return <Tag color="success">Miễn phí</Tag>;
    case "PAID":
      return <Tag color="warning">Trả phí</Tag>;
    default:
      return <Tag color="default">Không xác định</Tag>;
  }
}

const MovieTable = ({ data }) => {
  const { getColumnSearchProps } = useSearchTable();
  const columns = [
    {
      title: "Tên phim",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps('title'),
      render: (text, record, index) => {
        return (
          <RouterLink to={`/admin/movies/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: "Loại phim",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps('type'),
      render: (text, record, index) => {
        return parseMovieType(text)
      },
    },
    {
      title: "Hình thức",
      dataIndex: "accessType",
      key: "accessType",
      ...getColumnSearchProps('accessType'),
      render: (text, record, index) => {
        return parseMovieAccessType(text)
      },
    },
    {
      title: "Năm phát hành",
      dataIndex: "releaseYear",
      key: "releaseYear",
      ...getColumnSearchProps('releaseYear'),
      sorter: (a, b) => a.releaseYear - b.releaseYear,
      sortDirections: ['descend', 'ascend'],
      render: (text, record, index) => {
        return text;
      },
    },
    {
      title: "Thể loại",
      dataIndex: "genres",
      key: "genres",
      render: (text, record, index) => {
        return text.map((category) => (
          <Tag color={"geekblue"} key={category.id} style={{ marginBottom: 7 }}>
            {category.name}
          </Tag>
        ));
      },
    },
    {
      title: "Lượt xem",
      dataIndex: "view",
      key: "view",
      render: (text, record, index) => {
        return formatCurrency(text);
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (text, record, index) => {
        return (
          <Typography.Text>
            {text ?? 0} <StarOutlined style={{ color: "#EDBB0E" }} />
          </Typography.Text>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status - b.status,
      sortDirections: ['descend', 'ascend'],
      render: (text, record, index) => {
        return text ? <Tag color="success">Công khai</Tag> : <Tag color="warning">Nháp</Tag>;
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
export default MovieTable;
