import { DeleteOutlined, EditOutlined, StarOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Typography } from "antd";
import React, { useState } from "react";
import { useDeleteReviewMutation } from "../../../app/services/reviews.service";
import { formatDateTime } from "../../../utils/functionUtils";
import ModalUpdate from "./ModalUpdate";

const ReviewTable = ({ movieId, onReviewChange, data }) => {
    const [open, setOpen] = useState(false);
    const [reviews, setReviews] = useState(data);
    const [reviewUpdate, setReviewUpdate] = useState(null);
    const [deleteReview, { isLoading }] = useDeleteReviewMutation();

    const columns = [
        {
            title: "Họ tên",
            dataIndex: "user",
            key: "user",
            width: "15%",
            render: (text, record, index) => {
                return text.name;
            },
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            width: "10%",
            render: (text, record, index) => {
                return (
                    <Typography.Text>
                        {text} <StarOutlined style={{ color: "#EDBB0E" }} />
                    </Typography.Text>
                );
            },
        },
        {
            title: "Nội dung",
            dataIndex: "comment",
            key: "comment",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Thời gian",
            dataIndex: "createdAt",
            key: "createdAt",
            width: "15%",
            render: (text, record, index) => {
                return formatDateTime(text);
            },
        },
        {
            title: "",
            dataIndex: "",
            key: "action",
            width: "10%",
            render: (text, record, index) => {
                return (
                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setReviewUpdate(record);
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
            title: "Bạn có chắc chắn muốn xóa review này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
            onOk: () => {
                return new Promise((resolve, reject) => {
                    deleteReview(id)
                        .unwrap()
                        .then(() => {
                            setReviews(reviews.filter((review) => review.id !== id));
                            onReviewChange(-1);
                            message.success("Xóa review thành công!");
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

    const handleUpdateReview = (review) => {
        setReviews(
            reviews.map((item) => {
                if (item.id === review.id) {
                    return review;
                }
                return item;
            })
        );
    }

    return (
        <>
            <Table
                columns={columns}
                dataSource={reviews}
                rowKey={(record) => record.id}
            />

            {open && (
                <ModalUpdate
                    open={open}
                    onCancel={() => setOpen(false)}
                    review={reviewUpdate}
                    movieId={movieId}
                    onUpdateReview={handleUpdateReview}
                />
            )}
        </>
    );
};
export default ReviewTable;
