import { Button, Form, Input, InputNumber, Modal, Space, message } from "antd";
import React from "react";
import { useUpdateReviewMutation } from "../../../app/services/reviews.service";

const ModalUpdate = (props) => {
    const { review, open, onCancel, onUpdateReview, movieId } = props;
    const [updateReview, { isLoading }] = useUpdateReviewMutation();

    const onFinish = (values) => {
        updateReview({ reviewId: review.id, ...values, movieId })
            .unwrap()
            .then((data) => {
                onUpdateReview(data);
                message.success("Cập nhật review thành công!");
                onCancel();
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Modal
                open={open}
                title="Cập nhật review"
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ ...review }}
                >
                    <Form.Item
                        name="rating"
                        rules={[
                            {
                                required: true,
                                message: "Rating không được để trống!",
                            },
                            {
                                validator: (_, value) => {
                                    if (value <= 0 || value > 10) {
                                        return Promise.reject(
                                            "Rating phải lớn hơn 0 và nhỏ hơn hoặc bằng 10!"
                                        );
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber placeholder="Nhập rating" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="comment"
                        rules={[
                            {
                                required: true,
                                message: 'Nội dung review không được để trống!',
                            },
                        ]}
                    >
                        <Input.TextArea rows={5} placeholder="Nhập nội dung review" />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};
export default ModalUpdate;
