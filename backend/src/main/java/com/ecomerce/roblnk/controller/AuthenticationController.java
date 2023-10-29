package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.auth.RegisterRequest;
import com.ecomerce.roblnk.dto.auth.AuthenticationRequest;
import com.ecomerce.roblnk.dto.auth.UpdatePasswordRequest;
import com.ecomerce.roblnk.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import static com.ecomerce.roblnk.constants.PathConstants.*;

@RestController
@RequestMapping(API_V1_AUTH)
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    @PostMapping(REGISTER)
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult){
        return authenticationService.register(request, bindingResult);
    }

    @PostMapping(LOGIN)
    public ResponseEntity<?> login(@Valid @RequestBody AuthenticationRequest request){
        return authenticationService.login(request);
    }
    @GetMapping("/infor")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> information(){
        return authenticationService.findInforUser();

    }
    @PostMapping("/infor/update")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest, Principal connectedUser){
        return authenticationService.updatePassword(updatePasswordRequest, connectedUser);
    }

}
