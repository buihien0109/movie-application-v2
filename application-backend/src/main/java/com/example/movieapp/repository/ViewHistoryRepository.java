package com.example.movieapp.repository;

import com.example.movieapp.entity.ViewHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViewHistoryRepository extends JpaRepository<ViewHistory, Integer> {
}