package com.example.movieapp.payment.impl;

import com.example.movieapp.entity.Order;
import com.example.movieapp.model.response.PaymentResponse;
import com.example.movieapp.payment.PaymentStrategy;
import com.example.movieapp.payment.config.VnPayConfig;
import com.example.movieapp.payment.utils.vnpay.VnPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class VnPayPayment implements PaymentStrategy {
    private final VnPayConfig config;

    @Value("${app.vnp.ip.address}")
    private String vnpIpAddress;

    @Value("${app.backend.host}")
    private String backendHost;

    @Value("${app.backend.expose_port}")
    private String backendExposePort;

    private void initializeOrderParams(Map<String, String> params, Order order) {
        log.info("Creating order with order: {}", order);
        log.info("VNPay IP Address: {}", vnpIpAddress);
        String returnUrl = "%s:%s/api/public/payments/vnpay/callback".formatted(backendHost, backendExposePort);

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", config.getVnp_TmnCode());
        params.put("vnp_Amount", String.valueOf(order.getAmount() * 100));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", VnPayUtil.getRandomNumber(8));
        params.put("vnp_OrderInfo", String.valueOf(order.getId()));
        params.put("vnp_OrderType", "250000");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", vnpIpAddress);

        TimeZone timeZone = TimeZone.getTimeZone("GMT+7");
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(timeZone);
        Calendar calendar = Calendar.getInstance(timeZone);
        params.put("vnp_CreateDate", formatter.format(calendar.getTime()));
        calendar.add(Calendar.MINUTE, 10);
        params.put("vnp_ExpireDate", formatter.format(calendar.getTime()));
    }

    private String buildPaymentUrl(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = params.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {
                appendQueryParameters(hashData, query, fieldName, fieldValue, i > 0);
            }
        }

        String queryUrl = query.toString();
        String vnpSecureHash = VnPayUtil.hmacSHA512(config.getVnp_HashSecret(), hashData.toString());
        return config.getVnp_PayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;
    }

    private void appendQueryParameters(StringBuilder hashData, StringBuilder query, String fieldName, String fieldValue, boolean appendAmpersand) {
        if (appendAmpersand) {
            hashData.append('&');
            query.append('&');
        }

        String encodedFieldName = URLEncoder.encode(fieldName, StandardCharsets.UTF_8);
        String encodedFieldValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8);

        hashData.append(encodedFieldName).append('=').append(encodedFieldValue);
        query.append(encodedFieldName).append('=').append(encodedFieldValue);
    }

    public int orderReturn(HttpServletRequest request) {
        log.info("VNPay return with request: {}", request);
        Map<String, String> fields = new HashMap<>();
        Enumeration<String> parameterNames = request.getParameterNames();

        while (parameterNames.hasMoreElements()) {
            String fieldName = parameterNames.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                fields.put(URLEncoder.encode(fieldName, StandardCharsets.UTF_8), URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
            }
        }

        log.info("VNPay return fields: {}", fields);
        String vnpSecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        String signValue = VnPayUtil.hashAllFields(fields,  config.getVnp_HashSecret());
        if (signValue.equals(vnpSecureHash)) {
            return "00".equals(request.getParameter("vnp_TransactionStatus")) ? 1 : 0;
        } else {
            return -1;
        }
    }

    @Override
    public PaymentResponse pay(Order order) {
        Map<String, String> vnpParams = new HashMap<>();
        initializeOrderParams(vnpParams, order);

        String url = buildPaymentUrl(vnpParams);
        log.info("Payment URL: {}", url);

        return PaymentResponse.builder()
                .url(url)
                .build();
    }
}
