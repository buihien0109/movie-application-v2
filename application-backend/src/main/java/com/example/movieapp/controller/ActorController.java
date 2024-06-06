package com.example.movieapp.controller;

import com.example.movieapp.model.request.UpsertActorRequest;
import com.example.movieapp.service.ActorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/admin/actors")
@RequiredArgsConstructor
public class ActorController {
    private final ActorService actorService;

    @GetMapping
    public ResponseEntity<?> getAllActors() {
        return ResponseEntity.ok(actorService.getAllActors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getActorById(@PathVariable Integer id) {
        return ResponseEntity.ok(actorService.getActorById(id));
    }

    @PostMapping
    public ResponseEntity<?> createActor(@Valid @RequestBody UpsertActorRequest request) {
        return new ResponseEntity<>(actorService.saveActor(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateActor(@PathVariable Integer id, @Valid @RequestBody UpsertActorRequest request) {
        return ResponseEntity.ok(actorService.updateActor(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActor(@PathVariable Integer id) {
        actorService.deleteActor(id);
        return ResponseEntity.noContent().build();
    }
}
