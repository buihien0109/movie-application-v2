package com.example.movieapp.service;

import com.example.movieapp.entity.Movie;
import com.example.movieapp.entity.Order;
import com.example.movieapp.entity.User;
import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.dto.OrderDto;
import com.example.movieapp.model.enums.MovieAccessType;
import com.example.movieapp.model.enums.OrderStatus;
import com.example.movieapp.model.request.AdminCreateOrderRequest;
import com.example.movieapp.model.request.CreateOrderRequest;
import com.example.movieapp.model.request.UpdateOrderRequest;
import com.example.movieapp.repository.MovieRepository;
import com.example.movieapp.repository.OrderRepository;
import com.example.movieapp.repository.UserRepository;
import com.example.movieapp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final MailService mailService;

    public List<OrderDto> getOrdersByCurrentUser() {
        User user = SecurityUtils.getCurrentUserLogin();
        return orderRepository.findByUser_Id(user.getId(), Sort.by("createdAt").descending());
    }

    public List<OrderDto> getOrdersByUserId(Integer id) {
        return orderRepository.findByUser_Id(id, Sort.by("createdAt").descending());
    }

    public Order getOrderById(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll(Sort.by("createdAt").descending());
    }

    public Order createOrderByCustomer(CreateOrderRequest request) {
        // Kiểm tra xem phim có tồn tại hay không
        Movie movie = movieRepository.findByIdAndAccessType(request.getMovieId(), MovieAccessType.PAID)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim"));

        // Kiểm tra xem người dùng đã mua phim này chưa
        User user = SecurityUtils.getCurrentUserLogin();
        if (orderRepository.existsByUser_IdAndMovie_IdAndStatus(user.getId(), movie.getId(), OrderStatus.SUCCESS)) {
            throw new BadRequestException("Người dùng đã mua phim này rồi");
        }

        // Tạo mới order
        Order order = Order.builder()
                .user(user)
                .movie(movie)
                .amount(movie.getPrice())
                .status(OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .build();

        // Lưu vào database
        orderRepository.save(order);

        // Gửi mail xác nhận đặt hàng
        Map<String, Object> data = new HashMap<>();
        data.put("email", user.getEmail());
        data.put("user", user);
        data.put("order", order);
        mailService.sendMailConfirmOrder(data);
        log.info("Email sent to: {}", user.getEmail());

        return order;
    }

    public Order updateOrderByAdmin(Integer id, UpdateOrderRequest request) {
        log.info("id: {}, request: {}", id, request);
        // Kiểm tra xem id có tồn tại hay không
        Order order = getOrderById(id);

        // Câp nhật dữ liệu
        order.setStatus(request.getStatus());

        // Lưu vào database
        return orderRepository.save(order);
    }

    // Kiểm tra xem user đã mua phim này chưa? (OrderStatus.SUCCESS) -> return boolean
    public boolean checkPurchasedMovie(Integer movieId) {
        User user = SecurityUtils.getCurrentUserLogin();
        if (user == null) {
            return false;
        }
        return orderRepository.existsByUser_IdAndMovie_IdAndStatus(user.getId(), movieId, OrderStatus.SUCCESS);
    }

    public Order createOrderByAdmin(AdminCreateOrderRequest request) {
        log.info("request: {}", request);

        // Kiểm tra user có tồn tại hay không
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));

        // Kiểm tra xem phim có tồn tại hay không
        Movie movie = movieRepository.findByIdAndAccessType(request.getMovieId(), MovieAccessType.PAID)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim"));

        // Kiểm tra xem người dùng đã mua phim này chưa
        if (orderRepository.existsByUser_IdAndMovie_IdAndStatus(user.getId(), movie.getId(), OrderStatus.SUCCESS)) {
            throw new BadRequestException("Người dùng đã mua phim này rồi");
        }

        // Tạo mới order
        Order order = Order.builder()
                .user(user)
                .movie(movie)
                .amount(movie.getPrice())
                .status(OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .build();

        // Lưu vào database
        return orderRepository.save(order);
    }

    public List<Order> getOrdersOfMovieByCurrentUser(Integer movieId) {
        User user = SecurityUtils.getCurrentUserLogin();
        return orderRepository.findByUser_IdAndMovie_Id(user.getId(), movieId);
    }
}