package com.example.movieapp.payment.callback;

import com.example.movieapp.model.enums.OrderStatus;
import com.example.movieapp.payment.config.ZaloPayConfig;
import com.example.movieapp.service.OrderService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

@Slf4j
@RestController
@RequestMapping("/api/public/payments/zalopay/callback")
public class ZaloPayCallback {
    private final ObjectMapper objectMapper;
    private final OrderService orderService;
    private Mac HmacSHA256;

    public ZaloPayCallback(ZaloPayConfig zaloPayConfig, ObjectMapper objectMapper, OrderService orderService) throws Exception {
        this.objectMapper = objectMapper;
        this.orderService = orderService;
        HmacSHA256 = Mac.getInstance("HmacSHA256");
        HmacSHA256.init(new SecretKeySpec(zaloPayConfig.getKey2().getBytes(), "HmacSHA256"));
    }

    @PostMapping
    public ResponseEntity<?> callback(@RequestBody String jsonStr) {
        ObjectNode result = objectMapper.createObjectNode();

        try {
            JsonNode cbdata = objectMapper.readTree(jsonStr);
            String dataStr = cbdata.get("data").asText();
            String reqMac = cbdata.get("mac").asText();

            byte[] hashBytes = HmacSHA256.doFinal(dataStr.getBytes());
            String mac = DatatypeConverter.printHexBinary(hashBytes).toLowerCase();

            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (!reqMac.equals(mac)) {
                // callback không hợp lệ
                result.put("return_code", -1);
                result.put("return_message", "mac not equal");
            } else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                JsonNode data = objectMapper.readTree(dataStr);
                log.info("Callback data: {}", data);

                int orderId = Integer.parseInt(data.get("app_trans_id").asText().split("_")[1]);
                log.info("Order ID: {}", orderId);
                orderService.updateOrderStatus(orderId, OrderStatus.SUCCESS);

                result.put("return_code", 1);
                result.put("return_message", "success");
            }
        } catch (Exception ex) {
            result.put("return_code", 0); // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.put("return_message", ex.getMessage());
        }

        // Cập nhật trạng thái order dựa trên result
        return ResponseEntity.ok(result.toString());
    }
}
