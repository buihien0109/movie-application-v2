package com.example.movieapp.model.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@ToString
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {
    String url;
}
