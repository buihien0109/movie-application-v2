package com.example.movieapp.repository;

import com.example.movieapp.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    @Modifying
    @Query("update RefreshToken r set r.invalidated = true where r.user.id = :userId")
    void logOut(Integer userId);

    Optional<RefreshToken> findByUser_IdAndTokenAndInvalidated(Integer userId, String refreshToken, Boolean invalidated);

    Optional<RefreshToken> findByTokenAndInvalidated(String refreshToken, boolean b);
}