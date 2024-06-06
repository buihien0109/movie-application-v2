package com.example.movieapp.repository;

import com.example.movieapp.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, String> {
    @Query("select i from Image i where i.user.id = ?1 order by i.createdAt DESC")
    List<Image> findByUser_IdOrderByCreatedAtDesc(Integer id);

    List<Image> findByUser_Id(Integer id);

    @Modifying
    @Query("delete from Image i where i.user.id = ?1")
    void deleteAllImageByUser(Integer id);
}