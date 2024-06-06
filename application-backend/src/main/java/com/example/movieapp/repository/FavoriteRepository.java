package com.example.movieapp.repository;

import com.example.movieapp.entity.Favorite;
import com.example.movieapp.model.dto.FavoriteDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    @Query("SELECT new com.example.movieapp.model.dto.FavoriteDto(w.id, new com.example.movieapp.model.dto.MovieDto(f.id, f.title, f.slug, f.poster, f.type, f.accessType, f.rating, f.price, f.status, f.trailerUrl)) FROM Favorite w JOIN w.movie f WHERE w.user.id = ?1")
    Page<FavoriteDto> findByUser_Id(Integer userId, Pageable pageable);

    Optional<Favorite> findByUser_IdAndMovie_Id(Integer userId, Integer movieId);

    boolean existsByUser_IdAndMovie_Id(Integer userId, Integer movieId);
}