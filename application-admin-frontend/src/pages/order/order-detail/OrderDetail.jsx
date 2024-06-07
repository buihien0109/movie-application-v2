import { LeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Divider,
    Flex,
    message,
    Row,
    Select,
    Space,
    Spin,
    Tag,
    theme,
    Typography
} from "antd";
import "easymde/dist/easymde.min.css";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Link as RouterLink, useParams } from "react-router-dom";
import {
    useGetOrderByIdQuery,
    useUpdateOrderMutation
} from "../../../app/services/orders.service";
import ErrorPage from "../../../components/error-page/ErrorPage";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import { formatCurrency, formatDate } from "../../../utils/functionUtils";
import MovieTable from "./MovieTable";

const parseOrderStatus = (status) => {
    switch (status) {
        case "PENDING":
            return <Tag color="warning">Chờ thanh toán</Tag>;
        case "SUCCESS":
            return <Tag color="success">Đã thanh toán</Tag>;
        case "CANCEL":
            return <Tag color="red">Đã hủy</Tag>;
        default:
            return <Tag color="default">Không xác định</Tag>;
    }
}

const parsePaymentMethod = (method) => {
    switch (method) {
        case "MOMO":
            return <Tag color="warning">MOMO</Tag>;
        case "VN_PAY":
            return <Tag color="success">VNPAY</Tag>;
        case "ZALO_PAY":
            return <Tag color="blue">ZALO PAY</Tag>;
        case "BANK_TRANSFER":
            return <Tag color="volcano">Chuyển khoản ngân hàng</Tag>;
        default:
            return <Tag color="default">Không xác định</Tag>;
    }
}

const OrderDetail = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { orderId } = useParams();
    const [status, setStatus] = useState(null);
    const { data: order, isLoading, isError, error } =
        useGetOrderByIdQuery(Number(orderId));
    const [updateOrder, { isLoading: isLoadingUpdate }] = useUpdateOrderMutation();


    const breadcrumb = [
        { label: "Danh sách đơn hàng", href: "/admin/orders" },
        { label: `Đơn hàng ${order?.id}`, href: `/admin/orders/${order?.id}/detail` },
    ];

    useEffect(() => {
        if (order) {
            setStatus(order.status);
        }
    }, [order])


    if (isLoading) {
        return <Spin size="large" fullscreen />;
    }

    if (isError) {
        return <ErrorPage error={error} />;
    }

    const handleUpdate = () => {
        updateOrder({ orderId: order.id, status })
            .unwrap()
            .then(() => {
                message.success("Cập nhật đơn hàng thành công!");
            })
            .catch((error) => {
                if (error?.data?.message) {
                    message.error(error.data.message);
                }
            });
    }

    return (
        <>
            <Helmet>
                <title>{`Đơn hàng ${order?.id}`}</title>
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
                <Flex justify="space-between" align="center" style={{ marginBottom: "1rem" }}>
                    <Space>
                        <RouterLink to="/admin/orders">
                            <Button type="default" icon={<LeftOutlined />}>
                                Quay lại
                            </Button>
                        </RouterLink>
                        {order?.paymentMethod === "BANK_TRANSFER" && (
                            <Button
                                style={{ backgroundColor: "rgb(60, 141, 188)" }}
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleUpdate}
                                loading={isLoadingUpdate}
                            >
                                Cập nhật
                            </Button>
                        )}
                    </Space>
                </Flex>

                <Row gutter={16}>
                    <Col span={6}>
                        <Typography.Title level={5}>Thông tin đơn hàng</Typography.Title>
                        <Divider />
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Mã đơn hàng:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{order?.id}</Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Phim:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>
                                    <Link to={`/admin/movies/${order?.movie.id}/detail`}>{order?.movie.title}</Link>
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Ngày đặt:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{formatDate(order?.createdAt)}</Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>HT thanh toán:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{parsePaymentMethod(order?.paymentMethod)}</Typography.Paragraph>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={6}>
                        <Typography.Title level={5}>Thông tin khách hàng</Typography.Title>
                        <Divider />
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Khách hàng:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>
                                    <Link to={`/admin/users/${order?.user.id}/detail`}>{order?.user.name}</Link>
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Điện thoại:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{order?.user.phone}</Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Email:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{order?.user.email}</Typography.Paragraph>
                            </Col>
                        </Row>
                        {order?.paymentMethod === "BANK_TRANSFER" && (
                            <Row align="middle" style={{ marginBottom: "1rem" }}>
                                <Col span={7}>
                                    <Typography.Paragraph strong style={{ marginBottom: 0 }}>Trạng thái:</Typography.Paragraph>
                                </Col>
                                <Col span={17}>
                                    <Select
                                        onChange={(value) => setStatus(value)}
                                        style={{ width: "100%" }}
                                        value={status}
                                    >
                                        <Select.Option value="PENDING">Chờ thanh toán</Select.Option>
                                        <Select.Option value="SUCCESS">Đã thanh toán</Select.Option>
                                        <Select.Option value="CANCEL">Đã hủy</Select.Option>
                                    </Select>
                                </Col>
                            </Row>
                        )}
                        {order?.paymentMethod !== "BANK_TRANSFER" && (
                            <Row>
                                <Col span={7}>
                                    <Typography.Paragraph strong>Trạng thái:</Typography.Paragraph>
                                </Col>
                                <Col span={17}>
                                    <Typography.Paragraph>{parseOrderStatus(order?.status)}</Typography.Paragraph>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Tổng tiền:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>
                                    <Tag color="blue">{formatCurrency(order?.amount)}</Tag>
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={12}>
                        <Typography.Title level={5}>Chi tiết đơn hàng</Typography.Title>
                        <Divider />

                        <MovieTable movie={order?.movie} />
                    </Col>
                </Row>

            </div>
        </>
    );
};

export default OrderDetail;
