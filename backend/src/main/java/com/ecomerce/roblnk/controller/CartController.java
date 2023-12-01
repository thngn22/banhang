package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.cartItem.CartItemEditRequest;
import com.ecomerce.roblnk.service.CartService;
import com.ecomerce.roblnk.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final UserService userService;

    @GetMapping("/")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getCart(Principal principal) {
        return cartService.getUserCart(principal);
    }

    @PostMapping("/")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> editCart(Principal principal, @RequestBody @Valid List<CartItemEditRequest> list) {
        return cartService.editUserCart(principal, list);
    }



}
