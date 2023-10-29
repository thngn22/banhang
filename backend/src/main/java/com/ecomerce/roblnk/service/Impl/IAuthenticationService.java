package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.auth.*;
import com.ecomerce.roblnk.model.EnumRole;
import com.ecomerce.roblnk.model.Role;
import com.ecomerce.roblnk.model.Token;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.repository.RoleRepository;
import com.ecomerce.roblnk.repository.TokenRepository;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.service.AuthenticationService;
import com.ecomerce.roblnk.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.io.IOException;
import java.security.Principal;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class IAuthenticationService implements AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenRepository tokenRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;


    @Override
    public ResponseEntity<?> register(RegisterRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(401)).body(bindingResult.getAllErrors());
        }

        var role = new HashSet<Role>();
        role.add(roleRepository.findRoleByRole(EnumRole.ROLE_ADMINISTRATOR.name()));
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .userName(request.getUserName())
                .roles(role)
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(savedUser, jwtToken);

        return ResponseEntity.ok(AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build());
    }

    @Override
    public ResponseEntity<?> findInforUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("this is email: " + email);
        var user = userRepository.findByEmail(email).orElseThrow();
        var userInformation = UserInformationResponse.builder()
                .userName(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .isEmailActive(user.isEmailActive())
                .isPhoneActive(user.isPhoneActive())
                .avatar(user.getAvatar())
                .build();
        return ResponseEntity.ok(userInformation);
    }

    @Override
    public ResponseEntity<?> updatePassword(UpdatePasswordRequest updatePasswordRequest, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(updatePasswordRequest.getPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (updatePasswordRequest.getSecond_password().equals(updatePasswordRequest.getPassword())) {
            throw new IllegalStateException("Password are the same");
        }

        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getSecond_password()));
        userRepository.save(user);
        return ResponseEntity.ok("Password has been changed successfully!");
    }


    @Override
    public ResponseEntity<?> login(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return ResponseEntity.ok(AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
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
}
