package com.example.movieapp.controller;

import com.example.movieapp.service.ViewMovieLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/view-movie-logs")
@RequiredArgsConstructor
public class ViewMovieLogControlller {
    private final ViewMovieLogService viewMovieLogService;

    @PostMapping
    public ResponseEntity<?> createViewMovieLog(@Valid @RequestParam Integer movieId) {
        viewMovieLogService.createViewMovieLog(movieId);
        return ResponseEntity.noContent().build();
    }
}
