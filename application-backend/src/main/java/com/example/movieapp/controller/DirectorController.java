package com.example.movieapp.controller;

import com.example.movieapp.model.request.UpsertDirectorRequest;
import com.example.movieapp.service.DirectorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/admin/directors")
@RequiredArgsConstructor
public class DirectorController {
    private final DirectorService directorService;

    @GetMapping
    public ResponseEntity<?> getAllDirectors() {
        return ResponseEntity.ok(directorService.getAllDirectors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDirectorById(@PathVariable Integer id) {
        return ResponseEntity.ok(directorService.getDirectorById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDirector(@Valid @RequestBody UpsertDirectorRequest request) {
        return new ResponseEntity<>(directorService.saveDirector(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDirector(@PathVariable Integer id,
                                            @Valid @RequestBody UpsertDirectorRequest request) {
        return ResponseEntity.ok(directorService.updateDirector(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDirector(@PathVariable Integer id) {
        directorService.deleteDirector(id);
        return ResponseEntity.noContent().build();
    }
}
