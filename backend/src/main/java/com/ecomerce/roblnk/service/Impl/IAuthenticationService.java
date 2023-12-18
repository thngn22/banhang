package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.auth.*;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.model.*;
import com.ecomerce.roblnk.repository.CartRepository;
import com.ecomerce.roblnk.repository.RoleRepository;
import com.ecomerce.roblnk.repository.TokenRepository;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.service.AuthenticationService;
import com.ecomerce.roblnk.security.JwtService;
import com.ecomerce.roblnk.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.Date;
import java.util.HashSet;
import java.util.Random;

import static com.ecomerce.roblnk.constants.ErrorMessage.*;

@Service
@RequiredArgsConstructor
public class IAuthenticationService implements AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenRepository tokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final CartRepository cartRepository;


    @Override
    public ResponseEntity<?> register(RegisterRequest request) {

        try {
            var existedUser = userRepository.findByEmail(request.getEmail());
            if (existedUser.isPresent())
                return ResponseEntity.status(HttpStatus.CONFLICT).body(EMAIL_IN_USE);
            var role = new HashSet<Role>();
            role.add(roleRepository.findRoleByRole(EnumRole.ROLE_USER.name()));
            var user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setRoles(role);
            user.setActive(true);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            Cart cart = new Cart();
            cart.setUser(user);
            var otp = generateOTP(user);


            EmailDetails emailDetails = new EmailDetails();
            emailDetails.setSubject("Xác thực tài khoản mới!");
            emailDetails.setRecipient(user.getEmail());
            emailDetails.setMsgBody("Chào " + request.getEmail() +
                    ",\nChúng tôi rất vui thông báo rằng tài khoản của bạn đã được tạo thành công tại Shoes Shop. Dưới đây là thông tin tài khoản của bạn:\n"
                    + "\nMã OTP dành cho tài khoản " + request.getEmail() + " :"
                    + "\n\n" + otp
                    + "\n\n"
                    + "\nVới tài khoản này, bạn có thể truy cập Shoes Shop và tận hưởng các dịch vụ và tính năng mà chúng tôi cung cấp."
                    + "\nNếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ gì, xin đừng ngần ngại liên hệ với chúng tôi tại vunguyentrungkhang@gmail.com ."
                    + "\nChúng tôi rất mong được phục vụ bạn và chúc bạn có trải nghiệm tuyệt vời với Shoes Shop."
                    + "\nXin chân thành cảm ơn đã lựa chọn chúng tôi."
                    + "\n\nTrân trọng,\n" +
                    "Vũ Nguyễn Trung Khang");
            emailService.sendSimpleMail(emailDetails);
            userRepository.save(user);
            cartRepository.save(cart);
            return ResponseEntity.ok(ApiResponse.builder()
                    .statusCode(200)
                    .message("OTP has been sent to your email. Please check your email!")
                    .description("Successfully")
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } catch (UnsupportedEncodingException | MessagingException exception) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                    .statusCode(403)
                    .message(String.valueOf(HttpStatus.FORBIDDEN))
                    .description(exception.getLocalizedMessage())
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }

    }

    @Override
    public ResponseEntity<?> updatePassword(UpdatePasswordRequest updatePasswordRequest, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(updatePasswordRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                    .statusCode(400)
                    .message(String.valueOf(HttpStatus.FORBIDDEN))
                    .description(INCORRECT_PASSWORD)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }
        // check if new passwords are the same current password
        if (updatePasswordRequest.getNewPassword().equals(updatePasswordRequest.getPassword())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                    .statusCode(400)
                    .message(String.valueOf(HttpStatus.FORBIDDEN))
                    .description(NEW_PASSWORD_IS_SAME_CURRENT_PASSWORD)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }

        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.builder()
                .statusCode(200)
                .message(String.valueOf(HttpStatus.OK))
                .description("Password changed successfully!")
                .timestamp(new Date(System.currentTimeMillis()))
                .build());
    }

    @Override
    public ResponseEntity<?> validateLoginOTP(OtpRequest request) {
        var user = userRepository.findByEmail(request.getEmail());
        if (user.isPresent()) {
            if (user.get().isEmailActive()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponse.builder()
                        .statusCode(400)
                        .message(String.valueOf(HttpStatus.BAD_REQUEST))
                        .description("Invalid request!")
                        .timestamp(new Date(System.currentTimeMillis()))
                        .build());
            } else {
                if (passwordEncoder.matches(request.getOneTimePassword(), user.get().getOneTimePassword())) {
                    clearOTP(user.get());
                    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                            .statusCode(201)
                            .message(String.valueOf(HttpStatus.CREATED))
                            .description("Email has been active successfully! Please login!")
                            .timestamp(new Date(System.currentTimeMillis()))
                            .build());
                } else
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                            .statusCode(403)
                            .message(String.valueOf(HttpStatus.FORBIDDEN))
                            .description(OTP_NOT_VALID)
                            .timestamp(new Date(System.currentTimeMillis()))
                            .build());
            }
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                    .statusCode(404)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description(EMAIL_NOT_FOUND)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
    }

    @Override
    public boolean validateChangePasswordOTP(OtpRequest request) {
        var user = userRepository.findByEmail(request.getEmail());
        if (user.isPresent()) {
            if (user.get().getOneTimePassword().isEmpty()) {
                return false;
            } else {
                if (passwordEncoder.matches(request.getOneTimePassword(), user.get().getOneTimePassword())) {
                    clearOTP(user.get());
                    return true;
                } else
                    return false;
            }
        } else
            return false;
    }


    @Override
    public ResponseEntity<?> authenticate(AuthenticationRequest request, HttpServletRequest httpServletRequest, HttpServletResponse response, Authentication authentication) throws IOException {
        System.out.println("dâdw");
        var user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user != null) {
            if (!user.isEmailActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                        .statusCode(403)
                        .message(String.valueOf(HttpStatus.FORBIDDEN))
                        .description(INACTIVE_EMAIL)
                        .timestamp(new Date(System.currentTimeMillis()))
                        .build());
            }
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                        .statusCode(404)
                        .message(String.valueOf(HttpStatus.NOT_FOUND))
                        .description(INCORRECT_PASSWORD_OR_EMAIL)
                        .timestamp(new Date(System.currentTimeMillis()))
                        .build());
            } else {
                var jwtToken = jwtService.generateToken(user, user);
                var refreshToken = jwtService.generateRefreshToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, jwtToken);
                System.out.println("đã vào dc");
                Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
                refreshTokenCookie.setHttpOnly(true);
                response.addCookie(refreshTokenCookie);
                httpServletRequest.getCookies();
                System.out.println("đã vào dc response add cookie");
                return ResponseEntity.ok(AuthenticationResponse.builder()
                        .accessToken(jwtToken)
                        .build());
            }

        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                    .statusCode(400)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description(INCORRECT_PASSWORD_OR_EMAIL)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());

    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    public void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        Cookie[] Cookies = request.getCookies();
        String cookie_ = null;
        String userEmail = null;
        if (Cookies.length > 0){
            for (Cookie cookie : Cookies){
                System.out.println(cookie.getName());

                if (cookie.getName().equals("refreshToken")){
                    cookie_ = cookie.getValue();
                    System.out.println("name: " + cookie.getName());
                    System.out.println("value: " + cookie.getValue());
                    System.out.println("attribute: " + cookie.getAttribute("refreshToken"));
                    System.out.println("secure: " + cookie.getSecure());
                    System.out.println(cookie_);
                }
            }
        }
        else {
            var authResponse = ErrorResponse.builder()
                    .statusCode(400)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description("Did not found any cookies!")
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build();
            new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
        }

        userEmail = jwtService.extractEmail(cookie_);
        if (userEmail != null) {
            var user = userRepository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isFreshTokenValid(cookie_, user)) {
                var accessToken = jwtService.generateToken(user, user);
                var refreshToken = jwtService.generateRefreshToken(user);
                Cookie newCookie = new Cookie("refreshToken", refreshToken);
                newCookie.setHttpOnly(true);
                response.addCookie(newCookie);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public String generateOTP(User user)
            throws UnsupportedEncodingException, MessagingException {
        String numbers = "0123456789";
        int length = 6;
        Random rndm_method = new Random();
        char[] otp = new char[length];
        for (int i = 0; i < length; i++) {
            otp[i] = numbers.charAt(rndm_method.nextInt(numbers.length()));
        }
        String lmao = new String(otp);
        String encodedOTP = passwordEncoder.encode(lmao);

        user.setOneTimePassword(encodedOTP);
        user.setOtpRequestedTime(new Date(System.currentTimeMillis()));
        return lmao;
    }

    public void clearOTP(User user) {
        user.setOneTimePassword(null);
        user.setOtpRequestedTime(null);
        user.setEmailActive(true);
        userRepository.save(user);
    }
}
