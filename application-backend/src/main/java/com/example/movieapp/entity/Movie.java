package com.example.movieapp.entity;

import com.example.movieapp.model.enums.MovieAccessType;
import com.example.movieapp.model.enums.MovieType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String title;
    String titleEn;
    String slug;

    @Column(columnDefinition = "TEXT")
    String description;

    String poster;
    Integer releaseYear;
    Integer view;
    Double rating;

    @Enumerated(EnumType.STRING)
    MovieType type; // Loại phim: Phim lẻ, Phim bộ, Phim chiếu rạp

    @Enumerated(EnumType.STRING)
    MovieAccessType accessType; // Loại truy cập: Miễn phí, Trả phí

    Integer price; // Giá tiền
    Boolean status; // Nháp: false, Công khai: true
    String trailerUrl; // Link trailer

    Date createdAt;
    Date updatedAt;
    Date publishedAt;

    @ManyToOne
    @JoinColumn(name = "country_id")
    Country country;

    @ManyToMany
    @JoinTable(name = "movie_genre",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id"))
    @Fetch(FetchMode.SUBSELECT)
    private Set<Genre> genres = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "movie_director",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "director_id"))
    @Fetch(FetchMode.SUBSELECT)
    private Set<Director> directors = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "movie_actor",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "actor_id"))
    @Fetch(FetchMode.SUBSELECT)
    private Set<Actor> actors = new LinkedHashSet<>();

    @PrePersist
    public void prePersist() {
        createdAt = new Date();
        updatedAt = createdAt;
        if (status) {
            publishedAt = createdAt;
        }

        if (MovieAccessType.FREE.equals(accessType)) {
            price = null;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = new Date();
        if (status) {
            publishedAt = updatedAt;
        }

        if (MovieAccessType.FREE.equals(accessType)) {
            price = null;
        }
    }
}
