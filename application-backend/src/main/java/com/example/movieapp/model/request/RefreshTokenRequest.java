package com.example.movieapp.model.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshTokenRequest {
    @NotEmpty(message = "Refresh token không được để trống")
    String refreshToken;
}
