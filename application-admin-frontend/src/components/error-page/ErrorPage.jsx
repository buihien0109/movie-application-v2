import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ error }) => {
    return (
        <Result
            status={error.status || "404"}
            title={error.status || "404"}
            subTitle={error.data.message || "Sorry, the page you visited does not exist."}
            extra={
                <Link to="/admin/dashboard">
                    <Button type="primary">Back Home</Button>
                </Link>
            }
        />
    );
};

export default ErrorPage;
