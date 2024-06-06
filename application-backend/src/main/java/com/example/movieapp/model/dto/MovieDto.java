package com.example.movieapp.model.dto;

import com.example.movieapp.model.enums.MovieAccessType;
import com.example.movieapp.model.enums.MovieType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieDto {
    Integer id;
    String title;
    String slug;
    String poster;
    MovieType type;
    MovieAccessType accessType;
    Double rating;
    Integer price;
    Boolean status;
    String trailerUrl;
}
