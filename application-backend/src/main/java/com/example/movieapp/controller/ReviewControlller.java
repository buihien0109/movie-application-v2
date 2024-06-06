package com.example.movieapp.controller;

import com.example.movieapp.model.request.UpsertReviewRequest;
import com.example.movieapp.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ReviewControlller {
    private final ReviewService reviewService;

    @PostMapping("/api/reviews")
    public ResponseEntity<?> createReview(@Valid @RequestBody UpsertReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    @PutMapping("/api/reviews/{id}")
    public ResponseEntity<?> updateReview(@Valid @RequestBody UpsertReviewRequest request, @PathVariable Integer id) {
        return ResponseEntity.ok(reviewService.updateReview(request, id));
    }

    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/api/admin/reviews/{id}")
    public ResponseEntity<?> adminUpdateReview(@Valid @RequestBody UpsertReviewRequest request,
                                               @PathVariable Integer id) {
        return ResponseEntity.ok(reviewService.adminUpdateReview(request, id));
    }

    @DeleteMapping("/api/admin/reviews/{id}")
    public ResponseEntity<?> adminDeleteReview(@PathVariable Integer id) {
        reviewService.adminDeleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
