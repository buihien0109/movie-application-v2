import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Spin, message, theme } from "antd";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useCreateCouponMutation, useGetCouponsQuery } from "../../app/services/coupons.service";
import AppBreadCrumb from "../../components/layout/AppBreadCrumb";
import CouponTable from "./CouponTable";

const breadcrumb = [{ label: "Danh sách khuyến mại", href: "/admin/coupons" }];
const CouponList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { data, isLoading: isFetchingCoupons } = useGetCouponsQuery();
    const [createCoupon, { isLoading: isLoadingCreate }] =
        useCreateCouponMutation();

    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    if (isFetchingCoupons) {
        return <Spin size="large" fullscreen />;
    }

    const handleCreate = (values) => {
        createCoupon(values)
            .unwrap()
            .then((data) => {
                form.resetFields();
                setOpen(false);
                message.success("Tạo khuyến mại thành công!");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Helmet>
                <title>Danh sách khuyến mại</title>
            </Helmet>
            <AppBreadCrumb items={breadcrumb} />
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Space style={{ marginBottom: "1rem" }}>
                    <Button
                        style={{ backgroundColor: "rgb(60, 141, 188)" }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setOpen(true)}
                    >
                        Tạo khuyến mại
                    </Button>
                    <RouterLink to="/admin/coupons">
                        <Button
                            style={{ backgroundColor: "rgb(0, 192, 239)" }}
                            type="primary"
                            icon={<ReloadOutlined />}
                        >
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <CouponTable data={data} />
            </div>
            <Modal
                open={open}
                title="Tạo khuyến mại"
                footer={null}
                onCancel={() => setOpen(false)}
                confirmLoading={isLoadingCreate}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                    autoComplete="off"
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
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoadingCreate}
                            >
                                Lưu
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CouponList;
