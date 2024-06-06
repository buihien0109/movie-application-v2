import { Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { useGetDashboardDataQuery } from "../../../app/services/dashboard.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import DashboardSummary from "./summary/DashboardSummary";
import ViewChart from "./chart/ViewChart";
import DashboardTable from "./table/DashboardTable";

const Dashboard = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { data, isLoading: isFetchingDashboard } = useGetDashboardDataQuery();

    if (isFetchingDashboard) {
        return <Spin size="large" fullscreen />;
    }

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <AppBreadCrumb items={[]} />
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <DashboardSummary
                    latestOrdersCount={data?.latestOrdersCount}
                    latestMoviesCount={data?.latestMoviesCount}
                    latestUsersCount={data?.latestUsersCount}
                    latestBlogsCount={data?.latestBlogsCount}
                />
                <ViewChart
                    topViewMovies={data?.topViewMovies}
                    revenueByMonth={data?.revenueByMonth}
                />
                <DashboardTable
                    latestOrders={data?.latestOrders}
                    latestUsers={data?.latestUsers}
                />
            </div>
        </>
    );
};

export default Dashboard;
