package com.example.movieapp.controller;

import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.model.request.LoginRequest;
import com.example.movieapp.model.request.RefreshTokenRequest;
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
@RequestMapping("api")
@RequiredArgsConstructor
public class AuthControlller {
    private final AuthService authService;

    @PostMapping("/public/auth/login")
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

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout() {
        authService.logout();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/public/auth/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody @Valid RefreshTokenRequest request) {
        AuthResponse authResponse = authService.refreshToken(request);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/public/auth/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/public/auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/public/auth/check-forgot-password-token/{token}")
    public ResponseEntity<?> checkForgotPasswordToken(@PathVariable String token) {
        VerifyTokenResponse response = authService.checkForgotPasswordToken(token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/public/auth/check-register-token/{token}")
    public ResponseEntity<?> checkRegisterToken(@PathVariable String token) {
        VerifyTokenResponse response = authService.checkRegisterToken(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/public/auth/change-password")
    public ResponseEntity<?> confirmResetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok().build();
    }
}
