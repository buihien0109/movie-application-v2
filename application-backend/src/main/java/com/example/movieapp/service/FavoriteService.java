package com.example.movieapp.service;

import com.example.movieapp.entity.Favorite;
import com.example.movieapp.entity.Movie;
import com.example.movieapp.entity.User;
import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.dto.FavoriteDto;
import com.example.movieapp.model.request.AddFavoriteRequest;
import com.example.movieapp.repository.FavoriteRepository;
import com.example.movieapp.repository.MovieRepository;
import com.example.movieapp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final MovieRepository movieRepository;

    public Page<FavoriteDto> getFavoritesByCurrentUser(Integer page, Integer limit) {
        User user = SecurityUtils.getCurrentUserLogin();
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        return favoriteRepository.findByUser_Id(user.getId(), pageable);
    }

    public Favorite addToFavorite(AddFavoriteRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();

        // Kiểm tra xem movieId có tồn tại trong database không
        // Nếu không tồn tại thì throw exception
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Phim không tồn tại"));

        // Kiểm tra xem phim đã có trong danh sách yêu thích của user chưa
        // Nếu có rồi thì throw exception
        // Nếu chưa thì thêm vào danh sách yêu thích
        if (favoriteRepository.findByUser_IdAndMovie_Id(user.getId(), request.getMovieId()).isPresent()) {
            throw new BadRequestException("Phim đã có trong danh sách yêu thích");
        }

        Favorite favorite = Favorite.builder()
                .movie(movie)
                .user(user)
                .build();

        return favoriteRepository.save(favorite);
    }

    public void deleteFromFavorite(Integer movieId) {
        User user = SecurityUtils.getCurrentUserLogin();

        // Kiểm tra xem phim có tồn tại trong danh sách yêu thích của user không
        // Nếu không tồn tại thì throw exception
        // Nếu tồn tại thì xóa phim đó khỏi danh sách yêu thích
        Favorite favorite = favoriteRepository.findByUser_IdAndMovie_Id(user.getId(), movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Phim không tồn tại trong danh sách yêu thích"));

        favoriteRepository.delete(favorite);
    }

    public boolean checkMovieInFavorite(Integer movieId) {
        User user = SecurityUtils.getCurrentUserLogin();
        if (user == null) {
            log.warn("User is not authenticated");
            return false;
        }
        return favoriteRepository.existsByUser_IdAndMovie_Id(user.getId(), movieId);
    }
}
