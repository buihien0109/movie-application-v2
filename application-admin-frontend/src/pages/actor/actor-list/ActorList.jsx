import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useGetActorsQuery } from "../../../app/services/actors.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import ActorTable from "./ActorTable";

const breadcrumb = [
    { label: "Danh sách diễn viên", href: "/admin/actors" },
]
const ActorList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const {
        data,
        isLoading: isFetchingActors,
    } = useGetActorsQuery();

    if (isFetchingActors) {
        return <Spin size="large" fullscreen />
    }

    return (
        <>
            <Helmet>
                <title>Danh sách diễn viên</title>
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
                    <RouterLink to="/admin/actors/create">
                        <Button style={{ backgroundColor: 'rgb(60, 141, 188)' }} type="primary" icon={<PlusOutlined />}>
                            Tạo diễn viên
                        </Button>
                    </RouterLink>
                    <RouterLink to="/admin/actors">
                        <Button style={{ backgroundColor: 'rgb(0, 192, 239)' }} type="primary" icon={<ReloadOutlined />}>
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <ActorTable data={data} />
            </div>

        </>
    );
};

export default ActorList;
