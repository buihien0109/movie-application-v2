package com.example.movieapp.service;

import com.example.movieapp.entity.*;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.dto.EpisodeDto;
import com.example.movieapp.model.dto.MovieDto;
import com.example.movieapp.model.dto.ReviewDto;
import com.example.movieapp.model.enums.MovieAccessType;
import com.example.movieapp.model.enums.MovieType;
import com.example.movieapp.model.enums.OrderStatus;
import com.example.movieapp.model.request.UpsertMovieRequest;
import com.example.movieapp.repository.*;
import com.example.movieapp.security.SecurityUtils;
import com.example.movieapp.utils.StringUtils;
import com.github.slugify.Slugify;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ActorRepository actorRepository;
    private final DirectorRepository directorRepository;
    private final CountryRepository countryRepository;
    private final EpisodeRepository episodeRepository;
    private final ReviewRepository reviewRepository;
    private final Slugify slugify;
    private final EpisodeService episodeService;

    public List<MovieDto> getHotMovies(int limit) {
        List<MovieDto> movieDtoList = movieRepository.findPhimHot();
        if (movieDtoList.size() > limit) {
            return movieDtoList.subList(0, limit);
        }
        return movieDtoList;
    }

    public Page<MovieDto> getMoviesByType(MovieType type, MovieAccessType accessType, Boolean status, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("publishedAt").descending());
        return movieRepository.findByTypeAndAccessTypeAndStatus(type, accessType, status, pageable);
    }

    public Page<MovieDto> getMoviesByAccessType(MovieAccessType accessType, Boolean status, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("publishedAt").descending());
        return movieRepository.findByAccessTypeAndStatus(accessType, status, pageable);
    }

    public Movie getMovieDetail(Integer id, String slug, MovieAccessType accessType, Boolean status) {
        return movieRepository.findByIdAndSlugAndAccessTypeAndStatus(id, slug, accessType, status)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim"));
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll(Sort.by("createdAt").descending());
    }

    public Movie getMovieById(Integer id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có id = " + id));
    }

    public Movie saveMovie(UpsertMovieRequest request) {
        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quốc gia có id = " + request.getCountryId()));

        // get all genres by genreIds
        Set<Genre> genres = genreRepository.findByIdIn(request.getGenreIds());

        // get all directors by directorIds
        Set<Director> directors = directorRepository.findByIdIn(request.getDirectorIds());

        // get all actors by actorIds
        Set<Actor> actors = actorRepository.findByIdIn(request.getActorIds());

        // create movie
        Movie movie = Movie.builder()
                .title(request.getTitle())
                .titleEn(request.getTitleEn())
                .slug(slugify.slugify(request.getTitle()))
                .trailerUrl(request.getTrailerUrl())
                .description(request.getDescription())
                .releaseYear(request.getReleaseYear())
                .poster(StringUtils.generateLinkImage(request.getTitle()))
                .type(request.getType())
                .status(request.getStatus())
                .country(country)
                .accessType(request.getAccessType())
                .price(request.getPrice())
                .genres(genres)
                .directors(directors)
                .actors(actors)
                .build();
        return movieRepository.save(movie);
    }

    public Movie updateMovie(Integer id, UpsertMovieRequest request) {
        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có id = " + id));

        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quốc gia có id = " + request.getCountryId()));

        // get all genres by genreIds
        Set<Genre> genres = genreRepository.findByIdIn(request.getGenreIds());

        // get all directors by directorIds
        Set<Director> directors = directorRepository.findByIdIn(request.getDirectorIds());

        // get all actors by actorIds
        Set<Actor> actors = actorRepository.findByIdIn(request.getActorIds());

        // update movie
        existingMovie.setTitle(request.getTitle());
        existingMovie.setTitleEn(request.getTitleEn());
        existingMovie.setSlug(slugify.slugify(request.getTitle()));
        existingMovie.setTrailerUrl(request.getTrailerUrl());
        existingMovie.setDescription(request.getDescription());
        existingMovie.setReleaseYear(request.getReleaseYear());
        existingMovie.setPoster(request.getPoster() == null ? StringUtils.generateLinkImage(request.getTitle()) : request.getPoster());
        existingMovie.setType(request.getType());
        existingMovie.setStatus(request.getStatus());
        existingMovie.setCountry(country);
        existingMovie.setAccessType(request.getAccessType());
        existingMovie.setPrice(request.getPrice());
        existingMovie.setGenres(genres);
        existingMovie.setDirectors(directors);
        existingMovie.setActors(actors);
        return movieRepository.save(existingMovie);
    }

    @Transactional
    public void deleteMovie(Integer id) {
        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có id = " + id));

        // delete episodes and videos
        List<Episode> episodes = episodeRepository.findByMovie_Id(id);
        for (Episode episode : episodes) {
            episodeService.deleteEpisode(episode.getId());
        }

        movieRepository.deleteById(id);
    }

    public Page<MovieDto> getPurchasedMoviesByCurrentUser(Integer page, Integer limit) {
        User user = SecurityUtils.getCurrentUserLogin();
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        return movieRepository.findMoviesBuyedOfUser(user.getId(), pageable);
    }

    public List<Movie> getAllMoviesByAccessType(MovieAccessType movieAccessType, Boolean status) {
        return movieRepository.findByAccessTypeAndStatus(movieAccessType, status);
    }

    public Page<ReviewDto> getReviewsByMovie(Integer id, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        return reviewRepository.findByMovie_IdOrderByCreatedAtDesc(id, pageable);
    }

    public List<ReviewDto> getReviewsByMovieAdmin(Integer id) {
        return reviewRepository.findByMovie_IdOrderByCreatedAtDesc(id);
    }

    public List<Movie> getRelateMovies(Integer id, Integer limit) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim"));
        return movieRepository.findRelateMovies(movie.getType(), movie.getAccessType(), true, id, PageRequest.of(0, limit)).getContent();
    }

    public List<EpisodeDto> getEpisodesByMovie(Integer id) {
        return episodeRepository.findByMovie_IdAndStatusOrderByDisplayOrderAsc(id, true);
    }

    public List<Episode> getEpisodesByMovieAdmin(Integer id) {
        return episodeRepository.findByMovie_IdOrderByDisplayOrderAsc(id);
    }
}
