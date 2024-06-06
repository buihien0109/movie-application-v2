package com.example.movieapp.repository;

import com.example.movieapp.entity.Movie;
import com.example.movieapp.model.dto.MovieDto;
import com.example.movieapp.model.dto.MovieViewDto;
import com.example.movieapp.model.enums.MovieAccessType;
import com.example.movieapp.model.enums.MovieType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Integer> {
    @Query("SELECT f FROM Movie f WHERE f.type = ?1 AND f.accessType = ?2 AND f.status = ?3 AND f.id <> ?4 ORDER BY f.publishedAt DESC")
    Page<Movie> findRelateMovies(MovieType type, MovieAccessType accessType, Boolean status, Integer movieId, Pageable pageable);

    // Tìm kiếm phim theo type, accessType, status -> sắp xếp theo publishedAt giảm dần -> phân trang -> return Page<MovieDto>
    @Query("SELECT new com.example.movieapp.model.dto.MovieDto(f.id, f.title, f.slug, f.poster, f.type, f.accessType, f.rating, f.price, f.status, f.trailerUrl) FROM Movie f WHERE f.type = ?1 AND f.accessType = ?2 AND f.status = ?3")
    Page<MovieDto> findByTypeAndAccessTypeAndStatus(MovieType type, MovieAccessType accessType, Boolean status, Pageable pageable);

    // Lấy danh sách phim hot -> sắp xếp theo số lượt xem giảm dần -> giới hạn số lượng phim trả về -> return List<MovieDto>
    @Query(value = "SELECT new com.example.movieapp.model.dto.MovieDto(f.id, f.title, f.slug, f.poster, f.type, f.accessType, f.rating, f.price, f.status, f.trailerUrl) FROM Movie f WHERE f.status = true AND f.accessType = 'FREE' ORDER BY f.view DESC")
    List<MovieDto> findPhimHot();

    long countByGenres_Id(Integer id);

    long countByDirectors_Id(Integer id);

    long countByActors_Id(Integer id);

    @Modifying
    @Query(value = "update movies set view = view + 1 where id = ?1", nativeQuery = true)
    void updateView(Integer id);

    @Query("SELECT new com.example.movieapp.model.dto.MovieDto(f.id, f.title, f.slug, f.poster, f.type, f.accessType, f.rating, f.price, f.status, f.trailerUrl) FROM Movie f WHERE f.accessType = ?1 AND f.status = ?2 ORDER BY f.publishedAt DESC")
    Page<MovieDto> findByAccessTypeAndStatus(MovieAccessType accessType, Boolean status, Pageable pageable);

    List<Movie> findByAccessTypeAndStatus(MovieAccessType accessType, Boolean status);

    // Get MovieDetailDto by movie id, movie slug, movie access type -> return Optional<MovieDetailDto>. In MovieDetailDto has CountryDto, Set<GenreDto>, Set<ActorDto>, Set<DirectorDto> using JPQL
//    @Query("SELECT new com.example.movieapp.model.dto.MovieDetailDto(f.id, f.title, f.slug, f.description, f.poster, f.releaseYear, f.view, f.rating, f.type, f.accessType, f.price, f.status, f.trailerUrl, f.createdAt, f.updatedAt, f.publishedAt, new com.example.movieapp.model.dto.CountryDto(f.country.id, f.country.name, f.country.slug), g, a, d) FROM Movie f JOIN f.genres g JOIN f.actors a JOIN f.directors d WHERE f.id = ?1 AND f.slug = ?2 AND f.accessType = ?3")
    Optional<Movie> findByIdAndSlugAndAccessType(Integer id, String slug, MovieAccessType accessType);

    Optional<Movie> findByIdAndSlugAndAccessTypeAndStatus(Integer id, String slug, MovieAccessType accessType, Boolean status);

    List<Movie> findByIdBetween(Integer start, Integer end);

    // join movies and orders and find movies buyed of user and status of order is success and return List<MovieDto> using jqpl query
    @Query("SELECT new com.example.movieapp.model.dto.MovieDto(f.id, f.title, f.slug, f.poster, f.type, f.accessType, f.rating, f.price, f.status, f.trailerUrl) FROM Order o JOIN o.movie f WHERE o.user.id = ?1 AND o.status = 'SUCCESS'")
    Page<MovieDto> findMoviesBuyedOfUser(Integer id, Pageable pageable);

    long countByCreatedAtBetween(Date start, Date end);

    // find top 10 movies view in month, join movies and view_movie_logs and group by movie_id and order by count view desc using jpql query and return type is MovieViewDto
    @Query(value = "SELECT new com.example.movieapp.model.dto.MovieViewDto(f.id, f.title, f.slug, COUNT(v.id)) FROM Movie f JOIN ViewMovieLog v ON f.id = v.movie.id WHERE v.viewTime BETWEEN ?1 AND ?2 GROUP BY f.id ORDER BY COUNT(v.id) DESC")
    List<MovieViewDto> findTopViewMovies(Date start, Date end);

    Optional<Movie> findByIdAndAccessType(Integer id, MovieAccessType movieAccessType);

    List<Movie> findByAccessType(MovieAccessType movieAccessType);

    long countByCountry_Id(Integer id);

    @Query("SELECT new com.example.movieapp.model.dto.MovieDto(f.id, f.title, f.slug, f.poster, f.type, f.accessType, f.rating, f.price, f.status, f.trailerUrl) FROM Movie f JOIN f.country c WHERE f.accessType = ?1 AND f.status = ?2 AND c.slug = ?3 ORDER BY f.publishedAt DESC")
    Page<MovieDto> findByAccessTypeAndStatusAndCountry_SlugOrderByPublishedAtDesc(MovieAccessType accessType, Boolean status, String countrySlug, Pageable pageable);

    @Query("SELECT new com.example.movieapp.model.dto.MovieDto(f.id, f.title, f.slug, f.poster, f.type, f.accessType, f.rating, f.price, f.status, f.trailerUrl) FROM Movie f JOIN f.genres g WHERE f.accessType = ?1 AND f.status = ?2 AND g.slug = ?3 ORDER BY f.publishedAt DESC")
    Page<MovieDto> findByAccessTypeAndStatusAndGenres_SlugOrderByPublishedAtDesc(MovieAccessType accessType, Boolean status, String genreSlug, Pageable pageable);
}