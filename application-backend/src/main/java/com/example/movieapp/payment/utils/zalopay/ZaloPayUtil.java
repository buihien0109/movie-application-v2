package com.example.movieapp.payment.utils.zalopay;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.TimeZone;

@Slf4j
@Component
@RequiredArgsConstructor
public class ZaloPayUtil {
    private final ObjectMapper objectMapper;

    public String getCurrentTimeString(String format) {
        Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("GMT+7"));
        SimpleDateFormat fmt = new SimpleDateFormat(format);
        fmt.setCalendar(cal);
        return fmt.format(cal.getTime());
    }

    public String toJson(Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            log.error("JsonProcessingException: {}", e.getMessage());
        }
        return null;
    }
}
