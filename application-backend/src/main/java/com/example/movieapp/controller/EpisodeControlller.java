package com.example.movieapp.controller;

import com.example.movieapp.model.request.UpsertEpisodeRequest;
import com.example.movieapp.service.EpisodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class EpisodeControlller {
    private final EpisodeService episodeService;

    @GetMapping("/public/episodes")
    public ResponseEntity<?> getEpisode(@RequestParam Integer movieId,
                                        @RequestParam String tap) {
        return ResponseEntity.ok(episodeService.getEpisodeByDisplayOrder(movieId, true, tap));
    }

    @PostMapping("/admin/episodes")
    public ResponseEntity<?> createEpisode(@Valid @RequestBody UpsertEpisodeRequest request) {
        log.info("Request to create episode: {}", request);
        return new ResponseEntity<>(episodeService.saveEpisode(request), HttpStatus.CREATED);
    }

    @PostMapping("/admin/episodes/{id}/upload-video")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file, @PathVariable Integer id) {
        return ResponseEntity.ok(episodeService.uploadVideo(id, file));
    }

    @PutMapping("/admin/episodes/{id}")
    public ResponseEntity<?> updateEpisode(@PathVariable Integer id, @Valid @RequestBody UpsertEpisodeRequest request) {
        return ResponseEntity.ok(episodeService.updateEpisode(id, request));
    }

    @DeleteMapping("/admin/episodes/{id}")
    public ResponseEntity<?> deleteEpisode(@PathVariable Integer id) {
        episodeService.deleteEpisode(id);
        return ResponseEntity.noContent().build();
    }
}
