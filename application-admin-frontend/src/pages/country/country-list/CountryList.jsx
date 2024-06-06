import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, Spin, message, theme } from "antd";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import {
    useCreateCountryMutation,
    useGetCountriesQuery,
} from "../../../app/services/countries.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import CountryTable from "./CountryTable";

const breadcrumb = [{ label: "Danh sách quốc gia", href: "/admin/countries" }];
const CountryList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { data, isLoading: isFetchingCountries } = useGetCountriesQuery();
    const [createCountry, { isLoading: isLoadingCreate }] =
        useCreateCountryMutation();

    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    if (isFetchingCountries) {
        return <Spin size="large" fullscreen />;
    }

    const handleCreate = (values) => {
        createCountry(values)
            .unwrap()
            .then((data) => {
                form.resetFields();
                setOpen(false);
                message.success("Tạo quốc gia thành công!");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Helmet>
                <title>Danh sách quốc gia</title>
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
                        Tạo quốc gia
                    </Button>
                    <RouterLink to="/admin/countries">
                        <Button
                            style={{ backgroundColor: "rgb(0, 192, 239)" }}
                            type="primary"
                            icon={<ReloadOutlined />}
                        >
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <CountryTable data={data} />
            </div>
            <Modal
                open={open}
                title="Tạo quốc gia"
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
                                message: "Tên quốc gia không được để trống!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên quốc gia" />
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

export default CountryList;
