package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.auth.*;
import com.ecomerce.roblnk.model.User;
import io.jsonwebtoken.io.IOException;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.io.UnsupportedEncodingException;
import java.security.Principal;

public interface AuthenticationService {
    ResponseEntity<?> authenticate(AuthenticationRequest request, HttpServletRequest httpServletRequest, HttpServletResponse response, Authentication authentication) throws java.io.IOException;
    ResponseEntity<?> register(RegisterRequest request);

    ResponseEntity<?> updatePassword(UpdatePasswordRequest updatePasswordRequest, Principal connectedUser);

    ResponseEntity<?> validateLoginOTP(OtpRequest request);

    String validateChangePasswordOTP(OtpRequest request);
    void revokeAllUserTokens(User user);
    void refreshToken(HttpServletRequest request,
                             HttpServletResponse response) throws IOException, java.io.IOException;

    ResponseEntity<?> forgotPassword(@Valid EmailRequest email) throws MessagingException, UnsupportedEncodingException;
}
