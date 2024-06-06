package com.example.movieapp.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateHistoryRequest {
    @NotNull(message = "movieId không được để trống")
    Integer movieId;

    @NotNull(message = "EpisodeId không được để trống")
    Integer episodeId;

    @NotNull(message = "Duration không được để trống")
    Double duration;
}
