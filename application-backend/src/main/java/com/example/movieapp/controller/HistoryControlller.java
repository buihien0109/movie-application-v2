package com.example.movieapp.controller;

import com.example.movieapp.model.request.CreateHistoryRequest;
import com.example.movieapp.service.HistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/histories")
@RequiredArgsConstructor
public class HistoryControlller {
    private final HistoryService historyService;

    @GetMapping("/movies/{movieId}/episodes/{episodeId}")
    public ResponseEntity<?> getHistoryMovie(@PathVariable Integer movieId, @PathVariable Integer episodeId) {
        return ResponseEntity.ok(historyService.getHistoryMovie(movieId, episodeId));
    }

    @GetMapping
    public ResponseEntity<?> getHistoryMoviesByCurrentUser() {
        return ResponseEntity.ok(historyService.getHistoryMoviesByCurrentUser());
    }

    @PostMapping
    public ResponseEntity<?> addHistoryMovie(@Valid @RequestBody CreateHistoryRequest request) {
        historyService.addHistoryMovie(request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHistoryMovie(@PathVariable Integer id) {
        historyService.deleteHistoryMovie(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<?> deleteAllHistoryMovie() {
        historyService.deleteAllHistoryMovie();
        return ResponseEntity.noContent().build();
    }
}
