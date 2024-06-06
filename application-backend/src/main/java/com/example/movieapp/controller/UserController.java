package com.example.movieapp.controller;

import com.example.movieapp.model.request.CreateUserRequest;
import com.example.movieapp.model.request.UpdatePasswordRequest;
import com.example.movieapp.model.request.UpdateProfileUserRequest;
import com.example.movieapp.model.request.UpdateUserRequest;
import com.example.movieapp.service.OrderService;
import com.example.movieapp.service.UserService;
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
public class UserController {
    private final UserService userService;
    private final OrderService orderService;

    @GetMapping("/users/profile")
    public ResponseEntity<?> getUserProfile() {
        return ResponseEntity.ok(userService.getUserProfile());
    }

    @PostMapping("/users/update-avatar")
    public ResponseEntity<?> updateAvatar(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.updateAvatar(file));
    }

    @PutMapping("/users/update-profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileUserRequest request) {
        userService.updateProfile(request);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/update-password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/admin/users/get-by-enabled")
    public ResponseEntity<?> getAllUsersByEnabled(@RequestParam String enabled) {
        return ResponseEntity.ok(userService.getAllUsersByEnabled(Boolean.valueOf(enabled)));
    }

    @GetMapping("/admin/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping("/admin/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        return new ResponseEntity<>(userService.createUser(request), HttpStatus.CREATED);
    }

    @PutMapping("/admin/users/{id}")
    public ResponseEntity<?> updateGenre(@PathVariable Integer id, @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Integer id) {
        String password = userService.resetPassword(id);
        return ResponseEntity.ok(password);
    }

    @GetMapping("/admin/users/{id}/orders")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(id));
    }
}
