package com.example.movieapp.controller;

import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.model.request.LoginRequest;
import com.example.movieapp.model.request.RegisterRequest;
import com.example.movieapp.model.request.ResetPasswordRequest;
import com.example.movieapp.model.response.AuthResponse;
import com.example.movieapp.model.response.VerifyTokenResponse;
import com.example.movieapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/public/auth")
@RequiredArgsConstructor
public class AuthControlller {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse authResponse = authService.login(request);
            return ResponseEntity.ok(authResponse);
        } catch (DisabledException e) {
            throw new BadRequestException("Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email của bạn để kích hoạt tài khoản");
        } catch (AuthenticationException e) {
            throw new BadRequestException("Tài khoản hoặc mật khẩu không đúng");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check-forgot-password-token/{token}")
    public ResponseEntity<?> checkForgotPasswordToken(@PathVariable String token) {
        VerifyTokenResponse response = authService.checkForgotPasswordToken(token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-register-token/{token}")
    public ResponseEntity<?> checkRegisterToken(@PathVariable String token) {
        VerifyTokenResponse response = authService.checkRegisterToken(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> confirmResetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok().build();
    }
}
