package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.auth.AuthenticationRequest;
import com.ecomerce.roblnk.dto.auth.RegisterRequest;
import com.ecomerce.roblnk.dto.auth.UpdatePasswordRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import java.security.Principal;

public interface AuthenticationService {
    ResponseEntity<?> login(AuthenticationRequest request);
    ResponseEntity<?> register(RegisterRequest request, BindingResult bindingResult);

    ResponseEntity<?> findInforUser();
    ResponseEntity<?> updatePassword(UpdatePasswordRequest updatePasswordRequest, Principal connectedUser);
}
