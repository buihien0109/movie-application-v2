package com.example.movieapp.service;

import com.example.movieapp.entity.Movie;
import com.example.movieapp.entity.Review;
import com.example.movieapp.entity.User;
import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.dto.ReviewDto;
import com.example.movieapp.model.request.UpsertReviewRequest;
import com.example.movieapp.repository.MovieRepository;
import com.example.movieapp.repository.ReviewRepository;
import com.example.movieapp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {
    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;

    public List<ReviewDto> getReviewsOfMovie(Integer movieId) {
        return reviewRepository.findByMovie_IdOrderByCreatedAtDesc(movieId);
    }

    @Transactional
    public Review createReview(UpsertReviewRequest request) {
        // get user from spring security
        User user = SecurityUtils.getCurrentUserLogin();

        // find movie and check movie exist
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có id = " + request.getMovieId()));

        Review review = Review.builder()
                .user(user)
                .comment(request.getComment())
                .rating(request.getRating())
                .movie(movie)
                .build();
        reviewRepository.save(review);

        // update rating of movie
        updateRatingOfMovie(movie);

        return review;
    }

    @Transactional
    public Review updateReview(UpsertReviewRequest request, Integer id) {
        // get user from session
        User user = SecurityUtils.getCurrentUserLogin();

        // find movie and check movie exist
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có id = " + request.getMovieId()));

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy review có id = " + id));

        // check user is owner of review
        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Bạn không có quyền sửa review này");
        }

        // check review is for movie
        if (!review.getMovie().getId().equals(movie.getId())) {
            throw new BadRequestException("Review không thuộc phim này");
        }

        review.setComment(request.getComment());
        review.setRating(request.getRating());
        review.setMovie(movie);

        reviewRepository.save(review);

        // update rating of movie
        updateRatingOfMovie(movie);

        return review;
    }

    @Transactional
    public void deleteReview(Integer id) {
        // get user from session
        User user = SecurityUtils.getCurrentUserLogin();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy review có id = " + id));

        // check user is owner of review
        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Bạn không có quyền xóa review này");
        }

        reviewRepository.delete(review);

        // update rating of movie
        updateRatingOfMovie(review.getMovie());
    }

    @Transactional
    public void adminDeleteReview(Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy review có id = " + id));
        reviewRepository.delete(review);

        // update rating of movie
        updateRatingOfMovie(review.getMovie());
    }

    @Transactional
    public Review adminUpdateReview(UpsertReviewRequest request, Integer id) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có id = " + request.getMovieId()));

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy review có id = " + id));

        // check review is for movie
        if (!review.getMovie().getId().equals(movie.getId())) {
            throw new BadRequestException("Review không thuộc phim này");
        }

        review.setComment(request.getComment());
        review.setRating(request.getRating());
        review.setMovie(movie);

        reviewRepository.save(review);

        // update rating of movie
        updateRatingOfMovie(movie);

        return review;
    }

    private void updateRatingOfMovie(Movie movie) {
        List<Review> reviews = reviewRepository.findByMovie_Id(movie.getId());
        double rating = reviews.stream().mapToDouble(Review::getRating).average().orElse(0);
        rating = Math.round(rating * 10) / 10.0;
        movie.setRating(rating);
        movieRepository.save(movie);
    }
}
