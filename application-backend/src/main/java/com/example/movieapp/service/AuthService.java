package com.example.movieapp.service;

import com.example.movieapp.entity.TokenConfirm;
import com.example.movieapp.entity.User;
import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.dto.UserDto;
import com.example.movieapp.model.enums.TokenType;
import com.example.movieapp.model.enums.UserRole;
import com.example.movieapp.model.mapper.UserMapper;
import com.example.movieapp.model.request.LoginRequest;
import com.example.movieapp.model.request.RegisterRequest;
import com.example.movieapp.model.request.ResetPasswordRequest;
import com.example.movieapp.model.response.AuthResponse;
import com.example.movieapp.model.response.VerifyTokenResponse;
import com.example.movieapp.repository.TokenConfirmRepository;
import com.example.movieapp.repository.UserRepository;
import com.example.movieapp.security.JwtUtils;
import com.example.movieapp.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenConfirmRepository tokenConfirmRepository;
    private final UserMapper userMapper;
    private final JwtUtils jwtUtils;
    private final MailService mailService;

    public AuthResponse login(LoginRequest request) throws AuthenticationException {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        );

        Authentication authentication = authenticationManager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Tạo token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String tokenJwt = jwtUtils.generateToken(userDetails);

        // TODO: Tạo refresh token

        // Thông tin trả về cho Client
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user có email = " + request.getEmail()));
        UserDto userDto = userMapper.toUserDto(user);

        return AuthResponse.builder()
                .user(userDto)
                .accessToken(tokenJwt)
                .refreshToken(null)
                .isAuthenticated(true)
                .build();
    }

    public void register(RegisterRequest request) {
        // check email exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email đã tồn tại");
        }

        // check password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu xác nhận không khớp với mật khẩu");
        }

        // create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        user.setAvatar(StringUtils.generateLinkImage(request.getName()));
        user.setEnabled(false);
        userRepository.save(user);
        log.info("New user registered: {}", user);

        // Create token confirm
        TokenConfirm tokenConfirm = new TokenConfirm();
        tokenConfirm.setToken(UUID.randomUUID().toString());
        tokenConfirm.setUser(user);
        tokenConfirm.setType(TokenType.EMAIL_VERIFICATION);
        // set expiry date after 1 day
        tokenConfirm.setExpiryDate(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000));
        tokenConfirmRepository.save(tokenConfirm);
        log.info("Token confirm created: {}", tokenConfirm);

        // send email
        Map<String, String> data = new HashMap<>();
        data.put("email", user.getEmail());
        data.put("username", user.getName());
        data.put("token", tokenConfirm.getToken());
        mailService.sendMailConfirmRegistration(data);
        log.info("Email sent to: {}", user.getEmail());
    }

    @Transactional
    public VerifyTokenResponse checkRegisterToken(String token) {
        VerifyTokenResponse response = VerifyTokenResponse.builder()
                .token(token)
                .success(true)
                .message("Xác thực tài khoản thành công")
                .build();

        Optional<TokenConfirm> tokenConfirmOptional = tokenConfirmRepository
                .findByTokenAndType(token, TokenType.EMAIL_VERIFICATION);

        if (tokenConfirmOptional.isPresent()) {
            TokenConfirm tokenConfirm = tokenConfirmOptional.get();

            // Kiểm tra nếu token đã được xác nhận
            if (tokenConfirm.getConfirmedDate() != null) {
                response.setSuccess(false);
                response.setMessage("Token xác thực tài khoản đã được xác nhận");
            }
            // Kiểm tra nếu token đã hết hạn
            else if (tokenConfirm.getExpiryDate().before(new Date())) {
                response.setSuccess(false);
                response.setMessage("Token xác thực tài khoản đã hết hạn");
            }

            // Xác thực tài khoản
            User user = tokenConfirm.getUser();
            user.setEnabled(true);
            userRepository.save(user);

            tokenConfirm.setConfirmedDate(new Date());
            tokenConfirmRepository.save(tokenConfirm);
        } else {
            response.setSuccess(false);
            response.setMessage("Token xác thực tài khoản không hợp lệ");
        }

        return response;
    }

    public void forgotPassword(String email) {
        log.info("email: {}", email);
        // check email exist
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy email"));
        log.info("user: {}", user);
        log.info("user.getEmail(): {}", user.getEmail());

        // Create token confirm
        log.info("Create token confirm");
        TokenConfirm tokenConfirm = new TokenConfirm();
        tokenConfirm.setToken(UUID.randomUUID().toString());
        tokenConfirm.setUser(user);
        tokenConfirm.setType(TokenType.PASSWORD_RESET);
        // set expiry date after 1 day
        tokenConfirm.setExpiryDate(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000));
        tokenConfirmRepository.save(tokenConfirm);

        // send email
        log.info("Send email");
        Map<String, String> data = new HashMap<>();
        data.put("email", user.getEmail());
        data.put("username", user.getName());
        data.put("token", tokenConfirm.getToken());

        mailService.sendMailResetPassword(data);

        log.info("Send mail success");
    }

    @Transactional
    public void changePassword(ResetPasswordRequest request) {
        // check new password and confirm password
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu mới và mật khẩu xác nhận không khớp");
        }

        // get token confirm
        Optional<TokenConfirm> tokenConfirmOptional = tokenConfirmRepository
                .findByTokenAndType(request.getToken(), TokenType.PASSWORD_RESET);

        if (tokenConfirmOptional.isEmpty()) {
            throw new BadRequestException("Token đặt lại mật khẩu không hợp lệ");
        }

        TokenConfirm tokenConfirm = tokenConfirmOptional.get();
        if (tokenConfirm.getConfirmedDate() != null) {
            throw new BadRequestException("Token đặt lại mật khẩu đã được xác nhận");
        }

        if (tokenConfirm.getExpiryDate().before(new Date())) {
            throw new BadRequestException("Token đặt lại mật khẩu đã hết hạn");
        }

        User user = tokenConfirm.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenConfirm.setConfirmedDate(new Date());
        tokenConfirmRepository.save(tokenConfirm);

        log.info("Đặt lại mật khẩu thành công");
    }

    @Transactional
    public VerifyTokenResponse checkForgotPasswordToken(String token) {
        VerifyTokenResponse response = VerifyTokenResponse.builder()
                .token(token)
                .success(true)
                .message("Token đặt lại mật khẩu hợp lệ")
                .build();

        Optional<TokenConfirm> tokenConfirmOptional = tokenConfirmRepository
                .findByTokenAndType(token, TokenType.PASSWORD_RESET);

        if (tokenConfirmOptional.isPresent()) {
            TokenConfirm tokenConfirm = tokenConfirmOptional.get();

            // Kiểm tra nếu token đã được xác nhận
            if (tokenConfirm.getConfirmedDate() != null) {
                response.setSuccess(false);
                response.setMessage("Token đặt lại mật khẩu đã được xác nhận");
            }
            // Kiểm tra nếu token đã hết hạn
            else if (tokenConfirm.getExpiryDate().before(new Date())) {
                response.setSuccess(false);
                response.setMessage("Token đặt lại mật khẩu đã hết hạn");
            }
        } else {
            response.setSuccess(false);
            response.setMessage("Token đặt lại mật khẩu không hợp lệ");
        }

        return response;
    }
}
