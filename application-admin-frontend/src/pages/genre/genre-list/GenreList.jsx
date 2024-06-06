import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, Spin, message, theme } from "antd";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import {
    useCreateGenreMutation,
    useGetGenresQuery,
} from "../../../app/services/genres.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import GenreTable from "./GenreTable";

const breadcrumb = [{ label: "Danh sách thể loại", href: "/admin/genres" }];
const GenreList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { data, isLoading: isFetchingGenres } = useGetGenresQuery();
    const [createGenre, { isLoading: isLoadingCreate }] =
        useCreateGenreMutation();

    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    if (isFetchingGenres) {
        return <Spin size="large" fullscreen />;
    }

    const handleCreate = (values) => {
        createGenre(values)
            .unwrap()
            .then((data) => {
                form.resetFields();
                setOpen(false);
                message.success("Tạo thể loại thành công!");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Helmet>
                <title>Danh sách thể loại</title>
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
                        Tạo thể loại
                    </Button>
                    <RouterLink to="/admin/genres">
                        <Button
                            style={{ backgroundColor: "rgb(0, 192, 239)" }}
                            type="primary"
                            icon={<ReloadOutlined />}
                        >
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <GenreTable data={data} />
            </div>
            <Modal
                open={open}
                title="Tạo thể loại"
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
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Tên thể loại không được để trống!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên thể loại" />
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

export default GenreList;
