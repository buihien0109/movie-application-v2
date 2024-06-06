package com.example.movieapp.controller;

import com.example.movieapp.entity.Image;
import com.example.movieapp.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @GetMapping("/public/images/{id}")
    public ResponseEntity<?> readImage(@PathVariable String id) {
        Image image = imageService.getImageById(id);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getType()))
                .body(imageService.getImageData(image));
    }

    @GetMapping("/public/images/{id}/download")
    public ResponseEntity<Resource> downloadImage(@PathVariable String id) {
        Resource file = imageService.loadImageAsResource(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @GetMapping("/admin/images")
    public ResponseEntity<?> getAllImage() {
        return ResponseEntity.ok(imageService.getAllImage());
    }

    @PostMapping("/admin/images")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        return new ResponseEntity<>(imageService.uploadImage(file), HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/images/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable String id) {
        imageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}
