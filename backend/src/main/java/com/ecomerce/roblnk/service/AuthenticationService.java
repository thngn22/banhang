package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.auth.AuthenticationRequest;
import com.ecomerce.roblnk.dto.auth.OtpRequest;
import com.ecomerce.roblnk.dto.auth.RegisterRequest;
import com.ecomerce.roblnk.dto.auth.UpdatePasswordRequest;
import com.ecomerce.roblnk.model.User;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.security.Principal;

public interface AuthenticationService {
    ResponseEntity<?> authenticate(AuthenticationRequest request);
    ResponseEntity<?> register(RegisterRequest request);

    ResponseEntity<?> updatePassword(UpdatePasswordRequest updatePasswordRequest, Principal connectedUser);

    ResponseEntity<?> validateLoginOTP(OtpRequest request);

    boolean validateChangePasswordOTP(OtpRequest request);
    void revokeAllUserTokens(User user);
    void refreshToken(HttpServletRequest request,
                             HttpServletResponse response) throws IOException, java.io.IOException;

}
