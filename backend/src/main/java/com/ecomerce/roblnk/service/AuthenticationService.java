package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.auth.AuthenticationRequest;
import com.ecomerce.roblnk.dto.auth.RegisterRequest;
import com.ecomerce.roblnk.dto.auth.UpdatePasswordRequest;
import org.springframework.http.ResponseEntity;

import java.security.Principal;

public interface AuthenticationService {
    ResponseEntity<?> authenticate(AuthenticationRequest request);
    ResponseEntity<?> register(RegisterRequest request);

    ResponseEntity<?> findInformationUser(Principal connectedUser);
    ResponseEntity<?> updatePassword(UpdatePasswordRequest updatePasswordRequest, Principal connectedUser);
}
