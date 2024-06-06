package com.example.movieapp.repository;

import com.example.movieapp.entity.Review;
import com.example.movieapp.model.dto.ReviewDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    // Get all reviews of a movie by movie id and order by created date descending (newest first) -> return list of ReviewDto. In reviewDto has UserDto -> using JQPL query
    @Query("SELECT new com.example.movieapp.model.dto.ReviewDto(r.id, r.rating, r.comment, r.createdAt, r.updatedAt, new com.example.movieapp.model.dto.UserDto(r.user.id, r.user.name, r.user.email, r.user.phone, r.user.avatar, r.user.role, r.user.enabled)) FROM Review r WHERE r.movie.id = ?1 ORDER BY r.createdAt DESC")
    Page<ReviewDto> findByMovie_IdOrderByCreatedAtDesc(Integer id, Pageable pageable);

    @Query("SELECT new com.example.movieapp.model.dto.ReviewDto(r.id, r.rating, r.comment, r.createdAt, r.updatedAt, new com.example.movieapp.model.dto.UserDto(r.user.id, r.user.name, r.user.email, r.user.phone, r.user.avatar, r.user.role, r.user.enabled)) FROM Review r WHERE r.movie.id = ?1 ORDER BY r.createdAt DESC")
    List<ReviewDto> findByMovie_IdOrderByCreatedAtDesc(Integer id);

    List<Review> findByMovie_Id(Integer id);
}