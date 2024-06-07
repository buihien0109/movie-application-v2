import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useCheckPurchasedMovieQuery } from '../../app/apis/purchase.api';
import ErrorPage from '../error/ErrorPage';
import Loading from '../loading/Loading';

function PrivatePurchaseMovieStreaming() {
    const { movieId } = useParams();
    const { isAuthenticated } = useSelector(state => state.auth);
    if (!isAuthenticated) return <Navigate to="/" replace />;

    const {
        data: checkPurchasedMovie,
        isLoading: isLoading,
        isError: isError
    } = useCheckPurchasedMovieQuery(movieId, { refetchOnMountOrArgChange: true, skip: !isAuthenticated });

    if (isLoading) return <Loading />;
    if (isError) return <ErrorPage />;

    if(!checkPurchasedMovie.isPurchased) return <Navigate to="/" replace />;

    return (
        <>
            <Outlet />
        </>
    )
}

export default PrivatePurchaseMovieStreaming