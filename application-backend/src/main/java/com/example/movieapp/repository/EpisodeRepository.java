package com.example.movieapp.repository;

import com.example.movieapp.entity.Episode;
import com.example.movieapp.model.dto.EpisodeDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EpisodeRepository extends JpaRepository<Episode, Integer> {
    List<Episode> findAllByMovie_Id(Integer movieId);

    @Query("SELECT new com.example.movieapp.model.dto.EpisodeDto(e.id, e.displayOrder, e.title, e.status, e.video.duration, e.video.url) FROM Episode e WHERE e.movie.id = ?1 AND e.status = ?2 ORDER BY e.displayOrder ASC")
    List<EpisodeDto> findByMovie_IdAndStatusOrderByDisplayOrderAsc(Integer id, Boolean status);

    @Query("SELECT new com.example.movieapp.model.dto.EpisodeDto(e.id, e.displayOrder, e.title, e.status, e.video.duration, e.video.url) FROM Episode e WHERE e.movie.id = ?1 AND e.status = ?2 AND e.displayOrder = ?3")
    Optional<EpisodeDto> findByMovie_IdAndStatusAndDisplayOrder(Integer movie_id, Boolean status, Integer displayOrder);

    List<Episode> findByMovie_IdOrderByDisplayOrderAsc(Integer id);

    List<Episode> findByMovie_Id(Integer id);
}