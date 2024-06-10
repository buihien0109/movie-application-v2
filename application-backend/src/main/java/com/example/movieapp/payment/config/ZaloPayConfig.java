package com.example.movieapp.payment.config;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ZaloPayConfig {
    String app_id = "2554";
    String key1 = "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn";
    String key2 = "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf";
    String endpoint = "https://sb-openapi.zalopay.vn/v2/create";
}
