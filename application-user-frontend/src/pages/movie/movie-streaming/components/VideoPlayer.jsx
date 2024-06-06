import React, { useEffect, useRef, useState } from 'react';
import { useAddHistoryMovieMutation, useGetHistoryMovieQuery } from '../../../../app/apis/history.api';

const VideoPlayer = ({ movie, currentEpisode, isAuthenticated }) => {
    const videoRef = useRef(null);
    const currentEpisodeRef = useRef(currentEpisode);
    const [videoTime, setVideoTime] = useState(0);
    const { data: watchHistory } = useGetHistoryMovieQuery({
        movieId: movie.id,
        episodeId: currentEpisode.id
    }, { refetchOnMountOrArgChange: true, skip: !isAuthenticated });
    const [addHistoryMovie] = useAddHistoryMovieMutation();

    useEffect(() => {
        currentEpisodeRef.current = currentEpisode;
    }, [currentEpisode]);

    const updateWatchHistoryLocal = (currentTime) => {
        let watchHistory = JSON.parse(localStorage.getItem('watchHistory')) || [];

        const currentWatchData = {
            movieId: movie.id,
            episodeId: currentEpisodeRef.current.id,
            duration: parseFloat(currentTime),
        };

        const existingWatchDataIndex = watchHistory.findIndex(data => data.movieId === movie.id && data.episodeId === currentEpisodeRef.current.id);
        if (existingWatchDataIndex !== -1) {
            watchHistory[existingWatchDataIndex] = currentWatchData;
        } else {
            watchHistory.push(currentWatchData);
        }

        localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
    };

    const handlePause = () => {
        const currentTime = videoRef.current.currentTime;

        if (isAuthenticated) {
            addHistoryMovie({
                movieId: movie.id,
                episodeId: currentEpisodeRef.current.id,
                duration: parseFloat(currentTime),
            });
        } else {
            updateWatchHistoryLocal(currentTime);
        }
    };

    const handleBeforeUnload = () => {
        const currentTime = videoRef.current.currentTime;

        if (isAuthenticated) {
            addHistoryMovie({
                movieId: movie.id,
                episodeId: currentEpisodeRef.current.id,
                duration: parseFloat(currentTime),
            });
        } else {
            updateWatchHistoryLocal(currentTime);
        }
    };

    const setVideoTimeFromHistory = () => {
        if (watchHistory) {
            const { duration } = watchHistory;
            if (!isNaN(duration) && isFinite(duration)) {
                if (duration < currentEpisodeRef.current.duration) {
                    setVideoTime(duration);
                } else {
                    setVideoTime(0);
                }
            } else {
                setVideoTime(0);
            }
        } else {
            const localWatchHistory = JSON.parse(localStorage.getItem('watchHistory')) || [];
            const userWatchData = localWatchHistory.find(data => data.movieId === movie.id && data.episodeId === currentEpisodeRef.current.id);
            if (userWatchData) {
                const { duration } = userWatchData;
                if (!isNaN(duration) && isFinite(duration)) {
                    if (duration < currentEpisodeRef.current.duration) {
                        setVideoTime(duration);
                    } else {
                        setVideoTime(0);
                    }
                } else {
                    setVideoTime(0);
                }
            }
        }
    };

    useEffect(() => {
        setVideoTimeFromHistory();
    }, [watchHistory]);

    useEffect(() => {
        const videoElement = videoRef.current;
        videoElement.addEventListener('pause', handlePause);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            videoElement.removeEventListener('pause', handlePause);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isAuthenticated]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = videoTime;
        }
    }, [videoTime]);

    return (
        <div>
            <video
                ref={videoRef}
                controls
                width="100%"
                src={currentEpisode.videoUrl}
            >
                <source src={currentEpisode.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
