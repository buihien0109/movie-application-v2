import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, message, Row, Select, Space, Spin, Tag, theme, Typography } from "antd";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useGetMoviesByAccessTypeQuery } from "../../../app/services/movies.service";
import { useCreateOrderMutation } from "../../../app/services/orders.service";
import { useGetUsersByEnabledQuery } from "../../../app/services/users.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import { formatCurrency } from "../../../utils/functionUtils";

const breadcrumb = [
    { label: "Danh sách đơn hàng", href: "/admin/orders" },
    { label: "Tạo đơn hàng", href: "/admin/orders/create" },
];
const OrderCreate = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [movieSelected, setMovieSelected] = useState(null);
    const [createOrder, { isLoading: isLoadingCreate }] = useCreateOrderMutation();
    const { data: movies, isLoading: isLoadingMovies } = useGetMoviesByAccessTypeQuery({
        accessType: "PAID",
        status: true,
    });
    const { data: users, isLoading: isLoadingUsers } = useGetUsersByEnabledQuery(true);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    if (isLoadingMovies || isLoadingUsers) {
        return <Spin size="large" fullscreen />
    }

    const handleCreate = () => {
        form.validateFields()
            .then((values) => {
                return createOrder(values).unwrap()
            })
            .then((data) => {
                message.success("Tạo đơn hàng thành công!");
                setTimeout(() => {
                    navigate(`/admin/orders/${data.id}/detail`);
                }, 1500)
            })
            .catch((error) => {
                if (error?.data?.message) {
                    message.error(error.data.message);
                }
            });
    };

    return (
        <>
            <Helmet>
                <title>Tạo đơn hàng</title>
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
                    <RouterLink to="/admin/actors">
                        <Button type="default" icon={<LeftOutlined />}>
                            Quay lại
                        </Button>
                    </RouterLink>
                    <Button
                        style={{ backgroundColor: "rgb(60, 141, 188)" }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        loading={isLoadingCreate}
                    >
                        Tạo đơn hàng
                    </Button>
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Thông tin người nhận"
                                name="userId"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Thông tin người nhận không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a user"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={users.map((user) => ({
                                        label: user.name,
                                        value: user.id,
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Hình thức thanh toán"
                                name="paymentMethod"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Hình thức thanh toán không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a payment method"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={[
                                        { label: "MOMO", value: "MOMO" },
                                        { label: "ZaloPay", value: "ZALO_PAY" },
                                        { label: "VNPay", value: "VN_PAY" },
                                        { label: "Chuyển khoản ngân hàng", value: "BANK_TRANSFER" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Phim"
                                name="movieId"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Phim không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a movie"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={movies.map((movie) => ({
                                        label: movie.title,
                                        value: movie.id,
                                    }))}
                                    onChange={(value) => {
                                        const movie = movies.find((movie) => movie.id === Number(value));
                                        setMovieSelected(movie);
                                    }}
                                />
                            </Form.Item>

                            <Row style={{ marginBottom: "1rem" }}>
                                <Col span={6}>
                                    <Typography.Text strong>Giá tiền</Typography.Text>
                                </Col>
                                <Col span={12}>
                                    <Tag color="magenta">{formatCurrency(movieSelected?.price ?? 0)}</Tag>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Typography.Text strong>Thành tiền</Typography.Text>
                                </Col>
                                <Col span={12}>
                                    <Tag color="magenta">{formatCurrency(movieSelected?.price ?? 0)}</Tag>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default OrderCreate;
