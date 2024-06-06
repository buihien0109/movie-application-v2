import { Col, Row } from 'antd'
import React from 'react'
import RevenueMonthChart from './RevenueMonthChart'
import TopViewMovieChart from './TopViewMovieChart'

function ViewChart({ topViewMovies, revenueByMonth }) {
    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <TopViewMovieChart data={topViewMovies} />
            </Col>
            <Col span={12}>
                <RevenueMonthChart data={revenueByMonth} />
            </Col>
        </Row>
    )
}

export default ViewChart