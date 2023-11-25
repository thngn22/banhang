package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.auth.*;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.mapper.UserMapper;
import com.ecomerce.roblnk.model.EnumRole;
import com.ecomerce.roblnk.model.Role;
import com.ecomerce.roblnk.model.Token;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.repository.RoleRepository;
import com.ecomerce.roblnk.repository.TokenRepository;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.service.AuthenticationService;
import com.ecomerce.roblnk.security.JwtService;
import com.ecomerce.roblnk.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.Arrays;
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
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final EmailService emailService;


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
            user.setUserName(request.getUserName());
            user.setRoles(role);
            user.setActive(true);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            var otp = generateOTP(user);


            EmailDetails emailDetails = new EmailDetails();
            emailDetails.setSubject("Xác thực tài khoản mới!");
            emailDetails.setRecipient(user.getEmail());
            emailDetails.setMsgBody("Chào "+ request.getUserName() +
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
            //saveUserToken(savedUser, refreshToken);

            return ResponseEntity.ok("OTP has been sent to your email. Please check your email!");
        }
        catch (UnsupportedEncodingException | MessagingException exception){
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
            ResponseEntity.status(HttpStatusCode.valueOf(400)).body(INCORRECT_PASSWORD);
        }
        // check if new passwords are the same current password
        if (updatePasswordRequest.getNewPassword().equals(updatePasswordRequest.getPassword())) {
            ResponseEntity.status(HttpStatusCode.valueOf(400)).body(NEW_PASSWORD_IS_SAME_CURRENT_PASSWORD);
        }

        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Password has been changed successfully!");
    }

    @Override
    public ResponseEntity<?> validateLoginOTP(OtpRequest request) {
        var user = userRepository.findByEmail(request.getEmail());
        if (user.isPresent()){
            if (user.get().isEmailActive()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request");
            }
            else {
                if (passwordEncoder.matches(request.getOneTimePassword(), user.get().getOneTimePassword())){
                    clearOTP(user.get());
                    return ResponseEntity.status(HttpStatus.CREATED).body("Email has been active successfully! Please login!");
                }
                else
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(OTP_NOT_VALID);
            }
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(EMAIL_NOT_FOUND);
    }

    @Override
    public boolean validateChangePasswordOTP(OtpRequest request) {
        var user = userRepository.findByEmail(request.getEmail());
        if (user.isPresent()){
            if (user.get().getOneTimePassword().isEmpty()){
                return false;
            }
            else {
                if (passwordEncoder.matches(request.getOneTimePassword(), user.get().getOneTimePassword())){
                    clearOTP(user.get());
                    return true;
                }
                else
                    return false;
            }
        }
        else
            return false;
    }


    @Override
    public ResponseEntity<?> authenticate(AuthenticationRequest request) {

        var user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user != null){
            if (!user.isEmailActive()) {
                return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(INACTIVE_EMAIL);
            }
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatusCode.valueOf(400)).body(INCORRECT_PASSWORD_OR_EMAIL);
            }
            else{
                var jwtToken = jwtService.generateToken(user);
                var refreshToken = jwtService.generateRefreshToken(user);
                return ResponseEntity.ok(AuthenticationResponse.builder()
                        .accessToken(jwtToken)
                        .refreshToken(refreshToken)
                        .build());
            }

        }
        else
            return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(INCORRECT_PASSWORD_OR_EMAIL);

        //revokeAllUserTokens(user);
        //saveUserToken(user, refreshToken);
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

    private void revokeAllUserTokens(User user) {
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
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractEmail(refreshToken);
        if (userEmail != null) {
            var user = userRepository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
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
