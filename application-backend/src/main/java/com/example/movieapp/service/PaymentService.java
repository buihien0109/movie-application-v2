package com.example.movieapp.service;

import com.example.movieapp.entity.Order;
import com.example.movieapp.model.enums.OrderPaymentMethod;
import com.example.movieapp.model.response.PaymentResponse;
import com.example.movieapp.payment.PaymentStrategy;
import com.example.movieapp.payment.impl.BankTransferPayment;
import com.example.movieapp.payment.impl.MomoPayment;
import com.example.movieapp.payment.impl.VnPayPayment;
import com.example.movieapp.payment.impl.ZaloPayPayment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final BankTransferPayment bankTransferPayment;
    private final ZaloPayPayment zaloPayPayment;
    private final VnPayPayment vnPayPayment;
    private final MomoPayment momoPayment;

    public PaymentStrategy getPaymentStrategy(OrderPaymentMethod method) {
        return switch (method) {
            case BANK_TRANSFER -> bankTransferPayment;
            case ZALO_PAY -> zaloPayPayment;
            case VN_PAY -> vnPayPayment;
            case MOMO -> momoPayment;
        };
    }

    public PaymentResponse pay(Order order) {
        PaymentStrategy paymentStrategy = getPaymentStrategy(order.getPaymentMethod());
        return paymentStrategy.pay(order);
    }
}
