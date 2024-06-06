package com.example.movieapp.service;

import com.example.movieapp.entity.Movie;
import com.example.movieapp.entity.ViewMovieLog;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.repository.MovieRepository;
import com.example.movieapp.repository.ViewMovieLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ViewMovieLogService {
    private final ViewMovieLogRepository viewMovieLogRepository;
    private final MovieRepository movieRepository;

    @Transactional
    public void createViewMovieLog(Integer movieId) {
        // Kiểm tra phim có tồn tại không? Nếu không thì báo lỗi.
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có id = " + movieId));

        // Lưu thông tin vào bảng view_movie_logs.
        ViewMovieLog viewMovieLog = ViewMovieLog.builder()
                .movie(movie)
                .build();

        viewMovieLogRepository.save(viewMovieLog);

        // Cập nhật số lượt xem của phim.
        movieRepository.updateView(movieId);
    }
}
