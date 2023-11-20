package com.ecomerce.roblnk.configuration;

import com.ecomerce.roblnk.security.JwtAuthenticationEntryPoint;
import com.ecomerce.roblnk.security.JwtAuthenticationFilter;
import com.ecomerce.roblnk.security.LogoutService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;


import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;


@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration{

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final LogoutService logoutService;
    @Bean
    public SecurityFilterChain securityFilterChain(@NotNull HttpSecurity http) throws Exception{

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .authenticationProvider(authenticationProvider)
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                            new MvcRequestMatcher(new HandlerMappingIntrospector(),"/api/v1/vnpay"),
                            new MvcRequestMatcher(new HandlerMappingIntrospector(),"/api/v1/vnpay/"),
                            new MvcRequestMatcher(new HandlerMappingIntrospector(),"/api/v1/vnpay/submit_order"),
                            new MvcRequestMatcher(new HandlerMappingIntrospector(),"/api/v1/vnpay/payment"),
                            new MvcRequestMatcher(new HandlerMappingIntrospector(),"/api/v1/vnpay/payment/**"),
                            new AntPathRequestMatcher("/api/v1/auth/register/**"),
                            new AntPathRequestMatcher("/api/v1/auth/register"),
                            new AntPathRequestMatcher("/api/v1/auth/login"),
                            new AntPathRequestMatcher("/api/v1/auth/logout"),
                            new AntPathRequestMatcher("/swagger-ui/**"),
                            new AntPathRequestMatcher("/swagger-ui.html"),
                            new AntPathRequestMatcher("/configuration/ui"),
                            new AntPathRequestMatcher("/configuration/security"),
                            new AntPathRequestMatcher("/swagger-resources/**"),
                            new AntPathRequestMatcher("/swagger-resources"),
                            new AntPathRequestMatcher("/v2/api-docs"),
                            new AntPathRequestMatcher("/v3/api-docs"),
                            new AntPathRequestMatcher("/v3/api-docs/**")

                )
                        .permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(e -> e.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .logout(logout -> logout.logoutUrl("/api/v1/auth/logout")
                        .addLogoutHandler(logoutService)
                        .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext()))
                .formLogin(AbstractHttpConfigurer::disable)
                .build();

    }

}
