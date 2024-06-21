package com.example.movieapp.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String token;
    Boolean invalidated;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    Date createdAt;
    Date updatedAt;
    Date expiredAt;

    @PrePersist
    public void prePersist() {
        invalidated = false;
        createdAt = new Date();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = new Date();
    }
}
