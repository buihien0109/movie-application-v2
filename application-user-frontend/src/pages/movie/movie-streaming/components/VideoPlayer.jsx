import React, { useEffect, useRef, useState } from 'react';
import { useAddHistoryMovieMutation, useGetHistoryMovieQuery } from '../../../../app/apis/history.api';
import { useCreateViewMovieLogMutation } from '../../../../app/apis/viewLogs.api';
import { LOCAL_STORAGE_HISTORY_KEY } from '../../../../data/constants';

const VideoPlayer = ({ movie, currentEpisode, isAuthenticated }) => {
    const videoRef = useRef(null);
    const currentEpisodeRef = useRef(currentEpisode);
    const [videoTime, setVideoTime] = useState(0);
    const [createViewMovieLog] = useCreateViewMovieLogMutation();
    const [requestSent, setRequestSent] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const { data: watchHistory } = useGetHistoryMovieQuery({
        movieId: movie.id,
        episodeId: currentEpisode.id
    }, { refetchOnMountOrArgChange: true, skip: !isAuthenticated });
    const [addHistoryMovie] = useAddHistoryMovieMutation();

    useEffect(() => {
        currentEpisodeRef.current = currentEpisode;
    }, [currentEpisode]);

    const updateWatchHistoryLocal = (currentTime) => {
        let watchHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY)) || [];

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

        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(watchHistory));
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
            const localWatchHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY)) || [];
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

    useEffect(() => {
        const videoElement = videoRef.current;
        let startTime = 0;
        let endTime = 0;

        const handleTimeUpdate = () => {
            endTime = videoElement.currentTime;
            if (!isReset) {
                startTime = endTime;
                setIsReset(true);
            }

            const durationWatched = endTime - startTime;
            const completionPercentage = (durationWatched / currentEpisode.duration) * 100;
            if (!requestSent && completionPercentage >= 50) {
                createViewMovieLog(movie.id);
                setRequestSent(true);
            }
        };

        const handlePlay = () => {
            startTime = videoElement.currentTime;
        };

        const handleEnded = () => {
            const durationWatched = endTime - startTime;
            const completionPercentage = (durationWatched / currentEpisode.duration) * 100;
            if (!requestSent && completionPercentage >= 50) {
                createViewMovieLog(movie.id);
                setRequestSent(true);
            }
        };

        videoElement.addEventListener('timeupdate', handleTimeUpdate);
        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('ended', handleEnded);

        return () => {
            videoElement.removeEventListener('timeupdate', handleTimeUpdate);
            videoElement.removeEventListener('play', handlePlay);
            videoElement.removeEventListener('ended', handleEnded);
        };
    }, [requestSent, isReset, createViewMovieLog, currentEpisode.duration, movie.id]);

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
