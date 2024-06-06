package com.example.movieapp.model.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpsertCouponRequest {
    @NotEmpty(message = "Code không được để trống")
    String code;

    @NotNull(message = "Discount không được để trống")
    Integer discount;

    @NotNull(message = "Quantity không được để trống")
    Integer quantity;

    @NotNull(message = "Status không được để trống")
    Boolean status;

    @NotNull(message = "Start date không được để trống")
    Date startDate;

    @NotNull(message = "End date không được để trống")
    Date endDate;
}
