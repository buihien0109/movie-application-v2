import { Col, Row } from 'antd';
import React from 'react';
import SummaryBox from './SummaryBox';

function DashboardSummary({ latestOrdersCount, latestMoviesCount, latestUsersCount, latestBlogsCount }) {
    return (
        <Row gutter={[16, 16]}>
            <Col span={6}>
                <SummaryBox
                    title={`Đơn hàng mới`}
                    content={latestOrdersCount}
                    className="primary"
                    link="/admin/orders"
                />
            </Col>
            <Col span={6}>
                <SummaryBox
                    title={`Phim mới`}
                    content={latestMoviesCount}
                    className="info"
                    link="/admin/movies"
                />
            </Col>
            <Col span={6}>
                <SummaryBox
                    title={`User mới/Tổng số user`}
                    content={`${latestUsersCount.count}/${latestUsersCount.total}`}
                    className="warning"
                    link="/admin/users"
                />
            </Col>
            <Col span={6}>
                <SummaryBox
                    title={`Bài viết mới/Tổng số bài viết`}
                    content={`${latestBlogsCount.count}/${latestBlogsCount.total}`}
                    className="danger"
                    link="/admin/blogs"
                />
            </Col>
        </Row>
    )
}

export default DashboardSummary