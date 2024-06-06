package com.example.movieapp.controller;

import com.example.movieapp.entity.Favorite;
import com.example.movieapp.model.request.AddFavoriteRequest;
import com.example.movieapp.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FavoriteControlller {
    private final FavoriteService favoriteService;

    @GetMapping("/favorites/check-in-favorite")
    public ResponseEntity<?> checkMovieInFavorite(@RequestParam Integer movieId) {
        Boolean check = favoriteService.checkMovieInFavorite(movieId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isInFavorite", check);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavoritesByCurrentUser(@RequestParam(required = false, defaultValue = "1") Integer page,
                                                       @RequestParam(required = false, defaultValue = "12") Integer limit) {
        return ResponseEntity.ok(favoriteService.getFavoritesByCurrentUser(page, limit));
    }

    @PostMapping("/favorites")
    public ResponseEntity<?> addToFavorite(@Valid @RequestBody AddFavoriteRequest request) {
        Favorite favorite = favoriteService.addToFavorite(request);
        return ResponseEntity.ok(favorite);
    }

    @DeleteMapping("/favorites")
    public ResponseEntity<?> deleteFromFavorite(@RequestParam Integer movieId) {
        favoriteService.deleteFromFavorite(movieId);
        return ResponseEntity.noContent().build();
    }
}
