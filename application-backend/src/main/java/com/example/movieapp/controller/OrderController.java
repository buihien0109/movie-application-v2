package com.example.movieapp.controller;

import com.example.movieapp.model.enums.OrderStatus;
import com.example.movieapp.model.request.AdminCreateOrderRequest;
import com.example.movieapp.model.request.CreateOrderRequest;
import com.example.movieapp.model.request.UpdateOrderRequest;
import com.example.movieapp.service.OrderService;
import com.example.movieapp.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final VNPayService vnPayService;

    @Value("${app.frontend.host}")
    private String frontendHost;

    @Value("${app.frontend.port}")
    private String frontendPort;

    @GetMapping("/orders/history")
    public ResponseEntity<?> getOrdersByCurrentUser() {
        return ResponseEntity.ok(orderService.getOrdersByCurrentUser());
    }

    @GetMapping("/orders/movies/{id}")
    public ResponseEntity<?> getOrdersOfMovieByCurrentUser(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrdersOfMovieByCurrentUser(id));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // Customer tạo order
    @PostMapping("/orders")
    public ResponseEntity<?> createOrderByCustomer(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrderByCustomer(request));
    }

    @GetMapping("/orders/vnpay-payment")
    public ResponseEntity<?> GetMapping(HttpServletRequest request) {
        int paymentStatus = vnPayService.orderReturn(request);

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

    @GetMapping("/admin/orders")
    public ResponseEntity<?> getAllBlogs() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/admin/orders/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // Admin tạo order
    @PostMapping("/admin/orders")
    public ResponseEntity<?> createOrderByAdmin(@Valid @RequestBody AdminCreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrderByAdmin(request));
    }

    // Admin update order
    @PutMapping("/admin/orders/{id}")
    public ResponseEntity<?> updateOrderByAdmin(@PathVariable Integer id, @Valid @RequestBody UpdateOrderRequest request) {
        return ResponseEntity.ok(orderService.updateOrderByAdmin(id, request));
    }
}
