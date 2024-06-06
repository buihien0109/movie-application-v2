import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    Space,
    message,
    theme
} from "antd";
import "easymde/dist/easymde.min.css";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCreateBlogMutation } from "../../../app/services/blogs.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";

const breadcrumb = [
    { label: "Danh sách bài viết", href: "/admin/blogs" },
    { label: "Tạo bài viết", href: "/admin/blogs/create" },
];
const BlogCreate = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const [createBlog, { isLoading }] = useCreateBlogMutation();
    const navigate = useNavigate();

    const handleCreate = () => {
        form.validateFields()
            .then((values) => {
                return createBlog(values).unwrap();
            })
            .then((data) => {
                message.success("Tạo bài viết thành công!");
                setTimeout(() => {
                    navigate(`/admin/blogs/${data.id}/detail`);
                }, 1500);
            })
            .catch((error) => {
                if(error?.data?.message) {
                    message.error(error.data.message);
                }
            });
    };

    return (
        <>
            <Helmet>
                <title>Tạo bài viết</title>
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
                    <RouterLink to="/admin/blogs">
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
                        Tạo bài viết
                    </Button>
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    initialValues={{ status: false, content: "" }}
                >
                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                label="Tiêu đề"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tiêu đề không được để trống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter title" />
                            </Form.Item>

                            <Form.Item
                                label="Nội dung"
                                name="content"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Nội dung không được để trống!",
                                    },
                                ]}
                            >
                                <CKEditor
                                    editor={ClassicEditor}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        form.setFieldsValue({ content: data });
                                    }}
                                />
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
                                    rows={4}
                                    placeholder="Enter description"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
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
                                        { label: "Nháp", value: false },
                                        { label: "Công khai", value: true },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default BlogCreate;
