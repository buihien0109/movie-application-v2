import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import React, { useState } from "react";
import { useDeleteCouponMutation } from "../../app/services/coupons.service";
import useSearchTable from "../../hooks/useSearchTable";
import { formatDate } from "../../utils/functionUtils";
import ModalUpdate from "./ModalUpdate";

const CouponTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();
    const [open, setOpen] = useState(false);
    const [couponUpdate, setCouponUpdate] = useState(null);
    const [deleteCoupon, { isLoading }] = useDeleteCouponMutation();

    const columns = [
        {
            title: "Mã khuyến mại",
            dataIndex: "code",
            key: "code",
            ...getColumnSearchProps("code"),
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Phần trăm giảm giá",
            dataIndex: "discount",
            key: "discount",
            sorter: (a, b) => a.discount - b.discount,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return `${text}%`;
            },
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            sorter: (a, b) => a.quantity - b.quantity,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Đã sử dụng",
            dataIndex: "used",
            key: "used",
            sorter: (a, b) => a.used - b.used,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status - b.status,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                if (record.status) {
                    return <Tag color="success">Kích hoạt</Tag>;
                } else {
                    return <Tag color="default">Ẩn</Tag>;
                }
            },
        },
        {
            title: "Thời gian áp dụng",
            dataIndex: "startDate",
            key: "startDate",
            sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return `${formatDate(record.startDate)} - ${formatDate(record.endDate)}`;
            },
        },
        {
            title: "",
            dataIndex: "",
            key: "action",
            render: (text, record, index) => {
                return (
                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setCouponUpdate(record);
                                setOpen(true);
                            }}
                        ></Button>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                handleConfirm(record.id);
                            }}
                        ></Button>
                    </Space>
                );
            },
        },
    ];

    const handleConfirm = (id) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa khuyến mại này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
            onOk: () => {
                return new Promise((resolve, reject) => {
                    deleteCoupon(id)
                        .unwrap()
                        .then(() => {
                            message.success("Xóa khuyến mại thành công!");
                            resolve(); // Đóng modal sau khi xóa thành công
                        })
                        .catch((error) => {
                            message.error(error.data.message);
                            reject(); // Không đóng modal nếu xóa thất bại
                        });
                });
            },
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
            />

            {open && (
                <ModalUpdate
                    open={open}
                    onCancel={() => setOpen(false)}
                    coupon={couponUpdate}
                />
            )}
        </>
    );
};
export default CouponTable;
