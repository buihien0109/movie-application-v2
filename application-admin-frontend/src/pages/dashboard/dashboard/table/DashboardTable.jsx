import { Col, Divider, Flex, Row, Typography } from 'antd'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import TableLatestOrder from './TableLatestOrder'
import TableLatestUser from './TableLatestUser'

function DashboardTable({ latestOrders, latestUsers }) {
    return (
        <Row gutter={[24, 16]}>
            <Divider />
            <Col span={12}>
                <Flex justify='space-between' align='center' style={{ marginBottom: 10 }}>
                    <Typography.Title level={4} style={{ marginBottom: 0 }}>Đơn hàng mới nhất</Typography.Title>
                    <RouterLink to="/admin/orders">Xem tất cả</RouterLink>
                </Flex>
                <TableLatestOrder data={latestOrders} />
            </Col>
            <Col span={12}>
                <Flex justify='space-between' align='center' style={{ marginBottom: 10 }}>
                    <Typography.Title level={4} style={{ marginBottom: 0 }}>User mới nhất</Typography.Title>
                    <RouterLink to="/admin/users">Xem tất cả</RouterLink>
                </Flex>
                <TableLatestUser data={latestUsers} />
            </Col>
        </Row>
    )
}

export default DashboardTable