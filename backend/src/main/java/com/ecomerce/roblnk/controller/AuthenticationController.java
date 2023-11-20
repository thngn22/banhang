package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.auth.RegisterRequest;
import com.ecomerce.roblnk.dto.auth.AuthenticationRequest;
import com.ecomerce.roblnk.dto.auth.UpdatePasswordRequest;
import com.ecomerce.roblnk.exception.InputFieldException;
import com.ecomerce.roblnk.security.LogoutService;
import com.ecomerce.roblnk.service.AuthenticationService;
import com.ecomerce.roblnk.service.CloudinaryService;
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

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.ecomerce.roblnk.constants.PathConstants.*;

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
            return ResponseEntity.status(HttpStatusCode.valueOf(401)).body(Arrays.stream(Objects.requireNonNull(bindingResult.getAllErrors().get(0).getCodes())).toList().get(3).split("\\."));
        }
        return authenticationService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthenticationRequest request, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        return authenticationService.authenticate(request);
    }

    @GetMapping("/information")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> information(Principal connectedUser){
        return authenticationService.findInformationUser(connectedUser);

    }

    @PostMapping("/information/update")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest, Principal connectedUser){
        return authenticationService.updatePassword(updatePasswordRequest, connectedUser);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader HttpServletRequest request, HttpServletResponse response, Authentication authentication){
        logoutService.logout(request, response, authentication);
        return ResponseEntity.ok("Log out successfully!");
    }
    @PostMapping
    public ResponseEntity<Map<?,?>> uploadImage(@RequestParam("image") MultipartFile file){
        Map<?,?> data = cloudinaryService.uploadFile(file, "Product");
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
