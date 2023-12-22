package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.auth.*;
import com.ecomerce.roblnk.exception.InputFieldException;
import com.ecomerce.roblnk.security.LogoutService;
import com.ecomerce.roblnk.service.AuthenticationService;
import com.ecomerce.roblnk.service.CloudinaryService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.ecomerce.roblnk.constants.ErrorMessage.INCORRECT_PASSWORD_CONFIRMATION;
import static com.ecomerce.roblnk.constants.PathConstants.*;
import static com.ecomerce.roblnk.util.Side.SERVER_SITE_URL;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final CloudinaryService cloudinaryService;
    private final LogoutService logoutService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        return authenticationService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthenticationRequest authenticationRequest, BindingResult bindingResult, HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        return authenticationService.authenticate(authenticationRequest, request, response, authentication);
    }

    @PostMapping("/forgot_password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody EmailRequest email, BindingResult bindingResult) throws MessagingException, UnsupportedEncodingException {
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new InputFieldException(bindingResult).getMessage());
        }
        return authenticationService.forgotPassword(email);
    }
    @PostMapping("/check_otp_login")
    public ResponseEntity<?> checkOtp(@Valid @RequestBody OtpRequest request, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        return authenticationService.validateLoginOTP(request);
    }

    @PostMapping("/change_password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new InputFieldException(bindingResult).getMessage());
        }
        if (!updatePasswordRequest.getNewPassword().equals(updatePasswordRequest.getNewPasswordConfirm())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(INCORRECT_PASSWORD_CONFIRMATION);
        }
        return authenticationService.updatePassword(updatePasswordRequest);
    }

    @DeleteMapping("/logout")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication){
        logoutService.logout(request, response, authentication);
        return ResponseEntity.ok("Log out successfully!");
    }
    @PostMapping("/refresh")
    public void refresh(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        authenticationService.refreshToken(request, response);
    }
}
