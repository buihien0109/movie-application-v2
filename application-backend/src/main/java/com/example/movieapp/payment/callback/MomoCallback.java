package com.example.movieapp.payment.callback;

import com.example.movieapp.model.enums.OrderStatus;
import com.example.movieapp.service.OrderService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/public/payments/momo/callback")
@RequiredArgsConstructor
public class MomoCallback {
    private final ObjectMapper objectMapper;
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> callback(@RequestBody String jsonStr) {
        try {
            JsonNode cbdata = objectMapper.readTree(jsonStr);
            log.info("Callback data: {}", cbdata);

            // Xử lý callback từ MoMo
            int orderId = cbdata.get("orderId").asInt();
            int statusCode = cbdata.get("resultCode").asInt();

            // Cập nhật trạng thái order dựa trên callback data
            if(statusCode == 0) {
                orderService.updateOrderStatus(orderId, OrderStatus.SUCCESS);
            } else {
                orderService.updateOrderStatus(orderId, OrderStatus.CANCEL);
            }

        } catch (Exception ex) {
            log.error("Exception: {}", ex.getMessage());
        }

        // Cập nhật trạng thái order dựa trên result
        return ResponseEntity.ok().build();
    }
}
