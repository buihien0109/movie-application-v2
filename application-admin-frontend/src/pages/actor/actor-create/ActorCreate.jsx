import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Row, Space, message, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCreateActorMutation } from "../../../app/services/actors.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";

const breadcrumb = [
    { label: "Danh sách diễn viên", href: "/admin/actors" },
    { label: "Tạo diễn viên", href: "/admin/actors/create" },
];
const ActorCreate = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [createActor, { isLoading }] = useCreateActorMutation();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleCreate = () => {
        form.validateFields()
            .then((values) => {
                return createActor(values).unwrap()
            })
            .then((data) => {
                message.success("Tạo diễn viên thành công!");
                setTimeout(() => {
                    navigate(`/admin/actors/${data.id}/detail`);
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
                <title>Tạo diễn viên</title>
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
                        loading={isLoading}
                    >
                        Tạo Actor
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
                                label="Họ tên"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Họ tên không được để trống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter name" />
                            </Form.Item>

                            <Form.Item
                                label="Ngày sinh"
                                name="birthday"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ngày sinh không được để trống!",
                                    }
                                ]}
                            >
                                <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
                            </Form.Item>

                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Mô tả không được để trống!",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={6}
                                    placeholder="Enter description"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default ActorCreate;
