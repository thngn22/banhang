package com.ecomerce.roblnk.configuration;

import com.ecomerce.roblnk.security.JwtAuthenticationEntryPoint;
import com.ecomerce.roblnk.security.JwtAuthenticationFilter;
import com.ecomerce.roblnk.security.JwtAuthenticationFilterExceptionHandler;
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
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import static org.springframework.security.config.Customizer.withDefaults;


@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration{

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationFilterExceptionHandler jwtAuthenticationFilterExceptionHandler;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final LogoutService logoutService;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        return http
                .cors(withDefaults())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
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
                            new AntPathRequestMatcher("/api/v1/category", "GET"),
                            new AntPathRequestMatcher("/api/v1/category**", "GET"),
                            new AntPathRequestMatcher("/api/v1/category/all", "GET"),
                            new AntPathRequestMatcher("/api/v1/category/size", "GET"),
                            new AntPathRequestMatcher("/api/v1/category/size**", "GET"),
                            new AntPathRequestMatcher("/api/v1/category/color", "GET"),
                            new AntPathRequestMatcher("/api/v1/category/color**", "GET"),
                            new AntPathRequestMatcher("/api/v1/product/search**", "GET"),
                            new AntPathRequestMatcher("/api/v1/product/search", "GET"),
                            new AntPathRequestMatcher("/api/v1/product/**", "GET"),
                            new AntPathRequestMatcher("/api/v1/auth/sendOTP"),
                            new AntPathRequestMatcher("/api/v1/auth/login"),
                            new AntPathRequestMatcher("/api/v1/auth/refresh"),
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
//                .addFilterBefore(jwtAuthenticationFilterExceptionHandler, JwtAuthenticationFilter.class)
                .exceptionHandling(e -> e.authenticationEntryPoint(jwtAuthenticationEntryPoint))

//                .logout(logout -> logout.logoutRequestMatcher(new AntPathRequestMatcher("/api/v1/auth/logout", "POST")
//                        )
//                        .invalidateHttpSession(true)
//                        .deleteCookies("JSESSIONID")
//                        .addLogoutHandler(logoutService )
                        //.logoutSuccessUrl("/api/v1/category")
                        //.logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
//                )
                        //.addLogoutHandler(logoutService)
                        //.logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext()))
                .formLogin(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .build();

    }

}
