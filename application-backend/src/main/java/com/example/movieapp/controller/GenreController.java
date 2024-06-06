package com.example.movieapp.controller;

import com.example.movieapp.model.request.UpsertGenreRequest;
import com.example.movieapp.service.GenreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class GenreController {
    private final GenreService genreService;

    @GetMapping("/public/genres")
    public ResponseEntity<?> getAllGenres() {
        return ResponseEntity.ok(genreService.getAllGenres());
    }

    @GetMapping("/public/genres/{slug}")
    public ResponseEntity<?> getGenreBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(genreService.getGenreBySlug(slug));
    }

    @GetMapping("/public/genres/{slug}/movies")
    public ResponseEntity<?> getMoviesByGenre(@PathVariable String slug,
                                                @RequestParam(required = false, defaultValue = "1") Integer page,
                                                @RequestParam(required = false, defaultValue = "18") Integer limit) {
        return ResponseEntity.ok(genreService.getMoviesByGenre(slug, page, limit));
    }

    @GetMapping("/admin/genres")
    public ResponseEntity<?> getAllGenresByAdmin() {
        return ResponseEntity.ok(genreService.getAllGenres());
    }

    @GetMapping("/admin/genres/{id}")
    public ResponseEntity<?> getGenreById(@PathVariable Integer id) {
        return ResponseEntity.ok(genreService.getGenreById(id));
    }

    @PostMapping("/admin/genres")
    public ResponseEntity<?> createGenre(@Valid @RequestBody UpsertGenreRequest request) {
        return new ResponseEntity<>(genreService.saveGenre(request), HttpStatus.CREATED);
    }

    @PutMapping("/admin/genres/{id}")
    public ResponseEntity<?> updateGenre(@PathVariable Integer id,
                                         @Valid @RequestBody UpsertGenreRequest request) {
        return ResponseEntity.ok(genreService.updateGenre(id, request));
    }

    @DeleteMapping("/admin/genres/{id}")
    public ResponseEntity<?> deleteGenre(@PathVariable Integer id) {
        genreService.deleteGenre(id);
        return ResponseEntity.noContent().build();
    }
}
