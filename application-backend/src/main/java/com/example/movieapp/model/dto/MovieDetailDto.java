package com.example.movieapp.model.dto;

import com.example.movieapp.model.enums.MovieAccessType;
import com.example.movieapp.model.enums.MovieType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieDetailDto {
    Integer id;
    String title;
    String slug;
    String description;
    String poster;
    Integer releaseYear;
    Integer view;
    Double rating;
    MovieType type;
    MovieAccessType accessType;
    Integer price;
    Boolean status;
    String trailerUrl;
    Date createdAt;
    Date updatedAt;
    Date publishedAt;
    CountryDto country;
    Set<GenreDto> genres;
    Set<ActorDto> actors;
    Set<DirectorDto> directors;

    public MovieDetailDto(Integer id, String title, String slug, String poster, Double rating, Integer price, Set<GenreDto> genres) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.poster = poster;
        this.rating = rating;
        this.price = price;
        this.genres = genres;
    }
}
