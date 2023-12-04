package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.constants.ErrorMessage;
import com.ecomerce.roblnk.dto.user.UserCreateRequest;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.exception.InputFieldException;
import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.service.ProductService;
import com.ecomerce.roblnk.service.UserService;
import com.ecomerce.roblnk.service.VariationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;

import static com.ecomerce.roblnk.constants.ErrorMessage.EMAIL_NOT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {
    private final UserService userService;
    private final ProductService productService;
    @GetMapping("/user")
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
    @PostMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> createUser(Principal principal, @RequestBody @Valid UserCreateRequest userCreateRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        return userService.createUser(principal, userCreateRequest);
    }
    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getListUser(){
        var list =  userService.getAllUsers();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/users/active")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> deActiveOrActiveUser(Principal connectedUser, @RequestParam("id") Long id){
        return userService.deActiveOrActiveUser(connectedUser, id);
    }

    @GetMapping("/products")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllProduct() {
        var product = productService.getAllProductV2();
        if (product != null) {
            return ResponseEntity.status(HttpStatus.OK).body(product);
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }

}