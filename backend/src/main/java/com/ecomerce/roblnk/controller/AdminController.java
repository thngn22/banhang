package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.constants.ErrorMessage;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.service.UserService;
import com.ecomerce.roblnk.service.VariationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;

import static com.ecomerce.roblnk.constants.ErrorMessage.EMAIL_NOT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {
    private final UserService userService;
    private final VariationService variationService;
    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getDetailUser(@RequestParam("id") Long id) throws UserException {
        var user = userService.getDetailUser(id);
        if (user != null){
            return ResponseEntity.ok(user);
        }
        else return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(ErrorResponse.builder()
                .statusCode(404)
                .message(String.valueOf(HttpStatus.NOT_FOUND))
                .description(EMAIL_NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis()))
                .build());
    }
    @GetMapping("/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getListUser(){
        var list =  userService.getAllUsers();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> deActiveOrActiveUser(Principal connectedUser, @RequestParam("id") Long id){
        return userService.deActiveOrActiveUser(connectedUser, id);
    }



}
