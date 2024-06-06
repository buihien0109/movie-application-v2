package com.example.movieapp.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum MovieAccessType {
    FREE("Miễn phí"),
    PAID("Trả phí");

    private final String value;
}
