package com.example.movieapp;

import com.example.movieapp.entity.Order;
import com.example.movieapp.model.enums.OrderPaymentMethod;
import com.example.movieapp.model.response.PaymentResponse;
import com.example.movieapp.payment.PaymentStrategy;
import com.example.movieapp.repository.OrderRepository;
import com.example.movieapp.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Slf4j
@SpringBootTest
public class PaymentTests {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepository orderRepository;

    @Test
    void test_zalopay_payment() {
        PaymentStrategy paymentStrategy = paymentService.getPaymentStrategy(OrderPaymentMethod.MOMO);

        Order order = orderRepository.findById(63401484).get();
        PaymentResponse paymentResponse = paymentStrategy.pay(order);
        log.info("Payment response: {}", paymentResponse);
    }
}
