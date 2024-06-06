import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useGetDirectorsQuery } from "../../../app/services/directors.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import DirectorTable from "./DirectorTable";

const breadcrumb = [
    { label: "Danh sách đạo diễn", href: "/admin/directors" },
]
const DirectorList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const {
        data,
        isLoading: isFetchingDirectors,
    } = useGetDirectorsQuery();

    if (isFetchingDirectors) {
        return <Spin size="large" fullscreen />
    }

    return (
        <>
            <Helmet>
                <title>Danh sách đạo diễn</title>
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
                <Space style={{ marginBottom: '1rem' }}>
                    <RouterLink to="/admin/directors/create">
                        <Button style={{ backgroundColor: 'rgb(60, 141, 188)' }} type="primary" icon={<PlusOutlined />}>
                            Tạo đạo diễn
                        </Button>
                    </RouterLink>
                    <RouterLink to="/admin/directors">
                        <Button style={{ backgroundColor: 'rgb(0, 192, 239)' }} type="primary" icon={<ReloadOutlined />}>
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <DirectorTable data={data} />
            </div>

        </>
    );
};

export default DirectorList;
