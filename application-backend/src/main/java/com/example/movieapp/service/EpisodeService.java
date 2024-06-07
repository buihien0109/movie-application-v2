package com.example.movieapp.service;

import com.example.movieapp.entity.Episode;
import com.example.movieapp.entity.Movie;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.dto.EpisodeDto;
import com.example.movieapp.model.request.UpsertEpisodeRequest;
import com.example.movieapp.repository.EpisodeRepository;
import com.example.movieapp.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EpisodeService {
    private final EpisodeRepository episodeRepository;
    private final MovieRepository movieRepository;
    private final VideoService videoService;
    private final HistoryService historyService;

    public EpisodeDto getEpisodeByDisplayOrder(Integer movieId, Boolean status, String tap) {
        if (tap == null) {
            return null;
        }
        if (tap.equals("full")) {
            return episodeRepository.findByMovie_IdAndStatusAndDisplayOrder(movieId, status, 1).orElse(null);
        } else {
            return episodeRepository.findByMovie_IdAndStatusAndDisplayOrder(movieId, status, Integer.parseInt(tap)).orElse(null);
        }
    }

    public List<Episode> getAllEpisodesOfMovie(Integer movieId) {
        return episodeRepository.findAllByMovie_Id(movieId);
    }

    public Episode saveEpisode(UpsertEpisodeRequest request) {
        // Check movie is exist
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có id = " + request.getMovieId()));

        Episode episode = Episode.builder()
                .title(request.getTitle())
                .displayOrder(request.getDisplayOrder())
                .status(request.getStatus())
                .movie(movie)
                .build();

        return episodeRepository.save(episode);
    }

    public Episode updateEpisode(Integer id, UpsertEpisodeRequest request) {
        Episode existingEpisode = episodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tập phim có id = " + id));

        // Check movie is exist
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có id = " + request.getMovieId()));

        existingEpisode.setTitle(request.getTitle());
        existingEpisode.setDisplayOrder(request.getDisplayOrder());
        existingEpisode.setMovie(movie);
        existingEpisode.setStatus(request.getStatus());
        return episodeRepository.save(existingEpisode);
    }

    @Transactional
    public void deleteEpisode(Integer id) {
        Episode existingEpisode = episodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tập phim có id = " + id));

        // Delete video
        if (existingEpisode.getVideo() != null) {
            videoService.deleteVideo(existingEpisode.getVideo().getId());
        }

        // Delete history
        historyService.deleteHistoryByEpisodeId(id);

        // Delete episode
        episodeRepository.deleteById(id);
    }

    @Transactional
    public Episode uploadVideo(Integer id, MultipartFile file) {
        Episode existingEpisode = episodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tập phim có id = " + id));

        // Delete old video
        if (existingEpisode.getVideo() != null) {
            videoService.deleteVideo(existingEpisode.getVideo().getId());
        }

        // Upload new video
        existingEpisode.setVideo(videoService.createVideo(file));
        return episodeRepository.save(existingEpisode);
    }
}
