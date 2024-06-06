package com.example.movieapp.controller;

import com.example.movieapp.model.request.UpsertCouponRequest;
import com.example.movieapp.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class CouponController {
    private final CouponService couponService;

    @GetMapping("/coupons/{code}/check")
    public ResponseEntity<?> checkCoupon(@PathVariable String code) {
        return ResponseEntity.ok(couponService.checkCouponValid(code));
    }

    @GetMapping("/admin/coupons")
    public ResponseEntity<?> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @PostMapping("/admin/coupons")
    public ResponseEntity<?> createCoupon(@Valid @RequestBody UpsertCouponRequest request) {
        return ResponseEntity.ok(couponService.createCoupon(request));
    }

    @PutMapping("/admin/coupons/{id}")
    public ResponseEntity<?> updateCoupon(@PathVariable Integer id, @Valid @RequestBody UpsertCouponRequest request) {
        return ResponseEntity.ok(couponService.updateCoupon(id, request));
    }

    @DeleteMapping("/admin/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Integer id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok().build();
    }
}
