package com.example.movieapp.payment.config;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VnPayConfig {
    String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    String vnp_TmnCode = "CPJ15VKW";
    String vnp_HashSecret = "WMMQNMGUGAYDBFKLRIEEFOVTNUYPMPER";
    String vnp_apiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
}
