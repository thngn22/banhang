package com.ecomerce.roblnk.configuration;

import com.ecomerce.roblnk.security.JwtValidator;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

import javax.servlet.Filter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static com.ecomerce.roblnk.constants.JwtConstant.JWT_HEADER;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
public class ApplicationConfiguration{

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        return http
                .authorizeHttpRequests()
                    .antMatchers("/api/v1/auth/**",
                             "/api/v1/auth/login",
                             "/api/v1/registration/**",
                             "/api/v1/perfumes/**",
                             "/api/v1/users/cart",
                             "/api/v1/order/**",
                             "/api/v1/review/**",
                             "/websocket", "/websocket/**",
                             "/img/**",
                             "/static/**")
                    .authenticated()
                    .and()
                .authorizeHttpRequests()
                    .antMatchers("/home", "/").permitAll()
                    .anyRequest().authenticated()
                    .and()
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(new CorsConfigurationSource() {

            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(Arrays.asList(
                        "http://localhost:8081",
                        "http://localhost:4200"
                ));
                cfg.setAllowedMethods(Collections.singletonList("*"));
                cfg.setAllowCredentials(true);
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setExposedHeaders(List.of(JWT_HEADER));
                cfg.setMaxAge(3600L);
                return cfg;
            }
        }))
                .formLogin()
                    .permitAll()
                    .and()
                .httpBasic(Customizer.withDefaults())
                .build();


    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);
        return mapper;
    }
}
