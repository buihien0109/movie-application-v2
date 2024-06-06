package com.example.movieapp.model.request;

import com.example.movieapp.model.enums.OrderPaymentMethod;
import com.example.movieapp.model.enums.OrderStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UpdateOrderRequest {
    @NotNull(message = "Trạng thái không được để trống")
    OrderStatus status;
}
