package com.example.movieapp.security;

import com.example.movieapp.security.error.CustomAccessDenied;
import com.example.movieapp.security.error.CustomAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final AuthenticationProvider authenticationProvider;
    private final JwtCustomFilter jwtCustomFilter;
    private final CustomAccessDenied customAccessDenied;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults());
        http.csrf(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                        .requestMatchers("/api/orders/vnpay-payment").permitAll()
                        .requestMatchers("/api/users", "/api/users/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/favorites", "/api/favorites/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/histories", "/api/histories/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/reviews", "/api/reviews/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/orders", "/api/orders/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/coupons", "/api/coupons/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().permitAll()
        );
        http.exceptionHandling(exceptionHandling ->
                exceptionHandling
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                        .accessDeniedHandler(customAccessDenied)
        );
        http.sessionManagement(sessionManagement ->
                sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
        http.authenticationProvider(authenticationProvider);
        http.addFilterBefore(jwtCustomFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
