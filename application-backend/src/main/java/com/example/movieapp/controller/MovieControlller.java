package com.example.movieapp.controller;

import com.example.movieapp.model.enums.MovieAccessType;
import com.example.movieapp.model.enums.MovieType;
import com.example.movieapp.model.request.UpsertMovieRequest;
import com.example.movieapp.service.MovieService;
import com.example.movieapp.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class MovieControlller {
    private final MovieService movieService;
    private final OrderService orderService;

    @GetMapping("/public/movies/hot-movies")
    public ResponseEntity<?> getHotMovies(@RequestParam(defaultValue = "8") Integer limit) {
        return ResponseEntity.ok(movieService.getHotMovies(limit));
    }

    @GetMapping("/public/movies/latest-movies")
    public ResponseEntity<?> getLatestMovies(@RequestParam(defaultValue = "6") Integer limit,
                                             @RequestParam MovieType type) {
        return ResponseEntity.ok(movieService.getMoviesByType(type, MovieAccessType.FREE, true, 1, limit).getContent());
    }

    @GetMapping("/public/movies/get-by-type")
    public ResponseEntity<?> getMoviesByType(@RequestParam(required = false, defaultValue = "1") Integer page,
                                             @RequestParam(required = false, defaultValue = "18") Integer limit,
                                             @RequestParam MovieType type) {
        return ResponseEntity.ok(movieService.getMoviesByType(type, MovieAccessType.FREE, true, page, limit));
    }

    @GetMapping("/public/movies/get-by-access-type")
    public ResponseEntity<?> getMoviesByAccessType(@RequestParam(required = false, defaultValue = "1") Integer page,
                                                   @RequestParam(required = false, defaultValue = "18") Integer limit,
                                                   @RequestParam MovieAccessType accessType) {
        return ResponseEntity.ok(movieService.getMoviesByAccessType(accessType, true, page, limit));
    }

    @GetMapping("/public/movies/{id}/{slug}")
    public ResponseEntity<?> getMovieDetail(@PathVariable Integer id,
                                            @PathVariable String slug,
                                            @RequestParam MovieAccessType accessType) {
        return ResponseEntity.ok(movieService.getMovieDetail(id, slug, accessType, true));
    }

    @GetMapping("/public/movies/{id}/reviews")
    public ResponseEntity<?> getReviewsByMovie(@PathVariable Integer id,
                                               @RequestParam(required = false, defaultValue = "1") Integer page,
                                               @RequestParam(required = false, defaultValue = "18") Integer limit) {
        return ResponseEntity.ok(movieService.getReviewsByMovie(id, page, limit));
    }

    @GetMapping("/public/movies/{id}/related-movies")
    public ResponseEntity<?> getRelatedMovies(@PathVariable Integer id,
                                              @RequestParam(defaultValue = "6") Integer limit) {
        return ResponseEntity.ok(movieService.getRelateMovies(id, limit));
    }

    @GetMapping("/public/movies/{id}/episodes")
    public ResponseEntity<?> getEpisodesByMovie(@PathVariable Integer id) {
        return ResponseEntity.ok(movieService.getEpisodesByMovie(id));
    }

    @GetMapping("/movies/purchased")
    public ResponseEntity<?> getPurchasedMoviesByCurrentUser(@RequestParam(required = false, defaultValue = "1") Integer page,
                                                             @RequestParam(required = false, defaultValue = "18") Integer limit) {
        return ResponseEntity.ok(movieService.getPurchasedMoviesByCurrentUser(page, limit));
    }

    @GetMapping("/movies/check-purchased")
    public ResponseEntity<?> checkPurchasedMovie(@RequestParam Integer movieId) {
        Map<String, Boolean> map = new HashMap<>();
        map.put("isPurchased", orderService.checkPurchasedMovie(movieId));
        return ResponseEntity.ok(map);
    }

    @GetMapping("/admin/movies")
    public ResponseEntity<?> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/admin/movies/get-by-access-type")
    public ResponseEntity<?> getAllMoviesByAccessType(@RequestParam String accessType,
                                                      @RequestParam String status) {
        return ResponseEntity.ok(movieService.getAllMoviesByAccessType(MovieAccessType.valueOf(accessType), Boolean.valueOf(status)));
    }

    @GetMapping("/admin/movies/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Integer id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @GetMapping("/admin/movies/{id}/reviews")
    public ResponseEntity<?> getReviewsByMovieAdmin(@PathVariable Integer id) {
        return ResponseEntity.ok(movieService.getReviewsByMovieAdmin(id));
    }

    @GetMapping("/admin/movies/{id}/episodes")
    public ResponseEntity<?> getEpisodesByMovieAdmin(@PathVariable Integer id) {
        return ResponseEntity.ok(movieService.getEpisodesByMovieAdmin(id));
    }

    @PostMapping("/admin/movies")
    public ResponseEntity<?> createMovie(@Valid @RequestBody UpsertMovieRequest request) {
        log.info("Request to create movie: {}", request);
        return new ResponseEntity<>(movieService.saveMovie(request), HttpStatus.CREATED);
    }

    @PutMapping("/admin/movies/{id}")
    public ResponseEntity<?> updateMovie(@PathVariable Integer id, @Valid @RequestBody UpsertMovieRequest request) {
        log.info("Request to update movie: {}", request);
        return ResponseEntity.ok(movieService.updateMovie(id, request));
    }

    @DeleteMapping("/admin/movies/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Integer id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}
