package com.example.movieapp.repository;

import com.example.movieapp.entity.History;
import com.example.movieapp.model.dto.HistoryDto;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface HistoryRepository extends JpaRepository<History, Integer> {
    // Get all History of user by user id and sort by watchTime descending -> return List<History>. In History has MovieDto, UserDto, EpisodeDto using JPQL
    @Query("SELECT new com.example.movieapp.model.dto.HistoryDto(w.id, w.watchTime, w.duration, new com.example.movieapp.model.dto.UserDto(w.user.id, w.user.name, w.user.email, w.user.phone, w.user.avatar, w.user.role, w.user.enabled), new com.example.movieapp.model.dto.MovieDto(w.movie.id, w.movie.title, w.movie.slug, w.movie.poster, w.movie.type, w.movie.accessType, w.movie.rating, w.movie.price, w.movie.status, w.movie.trailerUrl), new com.example.movieapp.model.dto.EpisodeDto(w.episode.id, w.episode.displayOrder, w.episode.title, w.episode.status, w.episode.video.duration, w.episode.video.url)) FROM History w WHERE w.user.id = ?1")
    List<HistoryDto> findByUser_Id(Integer id, Sort sort);

    @Query("SELECT new com.example.movieapp.model.dto.HistoryDto(w.id, w.watchTime, w.duration, new com.example.movieapp.model.dto.UserDto(w.user.id, w.user.name, w.user.email, w.user.phone, w.user.avatar, w.user.role, w.user.enabled), new com.example.movieapp.model.dto.MovieDto(w.movie.id, w.movie.title, w.movie.slug, w.movie.poster, w.movie.type, w.movie.accessType, w.movie.rating, w.movie.price, w.movie.status, w.movie.trailerUrl), new com.example.movieapp.model.dto.EpisodeDto(w.episode.id, w.episode.displayOrder, w.episode.title, w.episode.status, w.episode.video.duration, w.episode.video.url)) FROM History w WHERE w.user.id = ?1 AND w.movie.id = ?2 AND w.episode.id = ?3")
    Optional<HistoryDto> findByUser_IdAndMovie_IdAndEpisode_Id(Integer userId, Integer movieId, Integer episodeId);

    Optional<History> findByUser_IdAndMovie_Id(Integer userId, Integer movieId);

    void deleteAllByUser_Id(Integer id);
}