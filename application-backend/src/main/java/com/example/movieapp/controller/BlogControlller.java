package com.example.movieapp.controller;

import com.example.movieapp.model.request.UpsertBlogRequest;
import com.example.movieapp.service.BlogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class BlogControlller {
    private final BlogService blogService;

    @GetMapping("/public/blogs")
    public ResponseEntity<?> getAllBlogs(@RequestParam(defaultValue = "1") Integer page,
                                         @RequestParam(defaultValue = "10") Integer limit) {
        return ResponseEntity.ok(blogService.getAllBlogs(page, limit));
    }

    @GetMapping("/public/blogs/latest-blogs")
    public ResponseEntity<?> getLatestBlogs(@RequestParam(defaultValue = "1") Integer page,
                                            @RequestParam(defaultValue = "10") Integer limit) {
        return ResponseEntity.ok(blogService.getAllBlogs(page, limit).getContent());
    }

    @GetMapping("/public/blogs/{id}/{slug}")
    public ResponseEntity<?> getBlogDetails(@PathVariable Integer id,
                                            @PathVariable String slug) {
        return ResponseEntity.ok(blogService.getBlogDetails(id, slug));
    }

    @GetMapping("/admin/blogs")
    public ResponseEntity<?> getAllBlog() {
        return ResponseEntity.ok(blogService.getAllBlog());
    }

    @GetMapping("/admin/blogs/own-blogs")
    public ResponseEntity<?> getOwnBlogs() {
        return ResponseEntity.ok(blogService.getOwnBlogs());
    }

    @PostMapping("/admin/blogs")
    public ResponseEntity<?> createBlog(@RequestBody UpsertBlogRequest request) {
        return new ResponseEntity<>(blogService.createBlog(request), HttpStatus.CREATED);
    }

    @GetMapping("/admin/blogs/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable Integer id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @PutMapping("/admin/blogs/{id}")
    public ResponseEntity<?> updateBlog(@PathVariable Integer id, @RequestBody UpsertBlogRequest request) {
        return ResponseEntity.ok(blogService.updateBlog(id, request));
    }

    @DeleteMapping("/admin/blogs/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Integer id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }
}
