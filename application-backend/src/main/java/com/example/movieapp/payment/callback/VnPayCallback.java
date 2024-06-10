package com.example.movieapp.payment.callback;

import com.example.movieapp.model.enums.OrderStatus;
import com.example.movieapp.payment.impl.VnPayPayment;
import com.example.movieapp.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/public/payments/vnpay/callback")
@RequiredArgsConstructor
public class VnPayCallback {
    private final OrderService orderService;
    private final VnPayPayment vnPayPayment;

    @Value("${app.frontend.host}")
    private String frontendHost;

    @Value("${app.frontend.port}")
    private String frontendPort;

    @GetMapping
    public ResponseEntity<?> GetMapping(HttpServletRequest request) {
        int paymentStatus = vnPayPayment.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        if (paymentStatus == 1) {
            orderService.updateOrderStatus(Integer.valueOf(orderInfo), OrderStatus.SUCCESS);
        } else {
            orderService.updateOrderStatus(Integer.valueOf(orderInfo), OrderStatus.CANCEL);
        }

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .header("Location", "%s:%s/thanh-toan-don-hang/%s".formatted(frontendHost, frontendPort, orderInfo))
                .build();
    }
}
