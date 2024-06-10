package com.example.movieapp.payment.impl;

import com.example.movieapp.entity.Order;
import com.example.movieapp.model.response.PaymentResponse;
import com.example.movieapp.payment.PaymentStrategy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class BankTransferPayment implements PaymentStrategy {
    @Value("${app.frontend.host}")
    private String frontendHost;

    @Value("${app.frontend.port}")
    private String frontendPort;

    @Override
    public PaymentResponse pay(Order order) {
        String returnUrl = "%s:%s/xac-nhan-don-hang/%s".formatted(frontendHost, frontendPort, order.getId());
        log.info("Redirect to bank transfer payment page with order: {}", order);

        return PaymentResponse.builder()
                .url(returnUrl)
                .build();
    }
}

