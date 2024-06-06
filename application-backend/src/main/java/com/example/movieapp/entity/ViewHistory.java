package com.example.movieapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "view_histories")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ViewHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "blog_id")
    Blog blog;

    @Column(name = "viewed_at")
    Date viewedAt;

    @PrePersist
    public void prePersist() {
        viewedAt = new Date();
    }
}
