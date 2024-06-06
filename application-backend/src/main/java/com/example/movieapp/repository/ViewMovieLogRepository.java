package com.example.movieapp.repository;

import com.example.movieapp.entity.ViewMovieLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViewMovieLogRepository extends JpaRepository<ViewMovieLog, Integer> {
}