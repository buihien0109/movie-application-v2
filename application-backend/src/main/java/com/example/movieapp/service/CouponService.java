package com.example.movieapp.service;

import com.example.movieapp.entity.Coupon;
import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.request.UpsertCouponRequest;
import com.example.movieapp.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepository couponRepository;

    public Coupon checkCouponValid(String couponCode) {
        Coupon coupon = couponRepository.findByCodeAndStatus(couponCode, true)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon không hợp lệ"));

        Date now = new Date();
        if (now.before(coupon.getStartDate()) || now.after(coupon.getEndDate())) {
            throw new BadRequestException("Coupon đã hết hạn");
        }

        if (coupon.getUsed() >= coupon.getQuantity()) {
            throw new BadRequestException("Coupon đã hết lượt sử dụng");
        }

        return coupon;
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll(Sort.by("createdAt").descending());
    }

    public Coupon createCoupon(UpsertCouponRequest request) {
        if (couponRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Mã coupon không được trùng nhau");
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode())
                .discount(request.getDiscount())
                .quantity(request.getQuantity())
                .used(0)
                .status(request.getStatus())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(Integer id, UpsertCouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon không tồn tại"));

        if (couponRepository.existsByCode(request.getCode()) && !coupon.getCode().equals(request.getCode())) {
            throw new BadRequestException("Mã coupon không được trùng nhau");
        }

        if (coupon.getUsed() > request.getQuantity()) {
            throw new BadRequestException("Số lượt sử dụng đã vượt quá số lượng coupon");
        }

        coupon.setCode(request.getCode());
        coupon.setDiscount(request.getDiscount());
        coupon.setQuantity(request.getQuantity());
        coupon.setStatus(request.getStatus());
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());

        return couponRepository.save(coupon);
    }

    public void deleteCoupon(Integer id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon không tồn tại"));

        if (coupon.getUsed() > 0) {
            throw new BadRequestException("Coupon đã được sử dụng không thể xóa");
        }

        couponRepository.delete(coupon);
    }

    public Coupon checkValidCoupon(String code) {
        Coupon coupon = couponRepository.findByCodeAndStatus(code, true)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon không hợp lệ"));

        Date now = new Date();
        if (now.before(coupon.getStartDate()) || now.after(coupon.getEndDate())) {
            throw new BadRequestException("Coupon đã hết hạn sử dụng");
        }

        if (coupon.getUsed() >= coupon.getQuantity()) {
            throw new BadRequestException("Coupon đã hết lượt sử dụng");
        }

        return coupon;
    }
}
