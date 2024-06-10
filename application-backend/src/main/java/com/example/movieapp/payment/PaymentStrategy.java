package com.example.movieapp.payment;

import com.example.movieapp.entity.Order;
import com.example.movieapp.model.response.PaymentResponse;

public interface PaymentStrategy {
    PaymentResponse pay(Order order);
}
