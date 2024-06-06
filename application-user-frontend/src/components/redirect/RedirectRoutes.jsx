import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectRoutes = ({ children, isAuthenticated }) => {
    return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default RedirectRoutes;