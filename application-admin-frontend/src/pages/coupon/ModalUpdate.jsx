import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, message } from "antd";
import dayjs from 'dayjs';
import React from "react";
import { useUpdateCouponMutation } from "../../app/services/coupons.service";
import { formatDate } from "../../utils/functionUtils";

const ModalUpdate = (props) => {
    const { coupon, open, onCancel } = props;
    const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

    const onFinish = (values) => {
        updateCoupon({ id: coupon.id, ...values })
            .unwrap()
            .then((data) => {
                message.success("Cập nhật khuyến mại thành công!");
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
                title="Cập nhật khuyến mại"
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{
                        ...coupon,
                        startDate: coupon.startDate ? dayjs(formatDate(coupon.startDate), 'DD/MM/YYYY') : null,
                        endDate: coupon.endDate ? dayjs(formatDate(coupon.endDate), 'DD/MM/YYYY') : null,
                    }}
                >
                    <Form.Item
                        label="Mã khuyến mại"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: "Mã khuyến mại không được để trống!",
                            },
                        ]}
                    >
                        <Input placeholder="Enter code" />
                    </Form.Item>

                    <Form.Item
                        label="Phần trăm trừ (%)"
                        name="discount"
                        rules={[
                            {
                                required: true,
                                message: "Phần trăm không được để trống!",
                            },
                            {
                                validator: (_, value) => {
                                    if (value > 100 || value < 0) {
                                        return Promise.reject(
                                            new Error("Phần trăm phải nằm trong khoảng 0 - 100")
                                        );
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber placeholder="Enter discount" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[
                            {
                                required: true,
                                message: "Số lượng không được để trống!",
                            },
                            {
                                validator: (_, value) => {
                                    if (value <= 0) {
                                        return Promise.reject(
                                            new Error("Số lượng phải lớn hơn 0")
                                        );
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber placeholder="Enter quantity" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Trạng thái không được để trống!",
                            },
                        ]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a status"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            options={[
                                { label: "Ẩn", value: false },
                                { label: "Kích hoạt", value: true },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ngày bắt đầu"
                        name="startDate"
                        rules={[
                            {
                                required: true,
                                message: "Ngày bắt đầu không được để trống!",
                            }
                        ]}
                    >
                        <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
                    </Form.Item>

                    <Form.Item
                        label="Ngày kết thúc"
                        name="endDate"
                        rules={[
                            {
                                required: true,
                                message: "Ngày kết thúc không được để trống!",
                            }
                        ]}
                    >
                        <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
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
