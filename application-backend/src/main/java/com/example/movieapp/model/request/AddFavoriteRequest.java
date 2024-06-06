package com.example.movieapp.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddFavoriteRequest {
    @NotNull(message = "Phim ID không được để trống")
    Integer movieId;
}
