package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.cart.CartEditRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.security.Principal;

public interface CartService {

    ResponseEntity<?> getUserCart(Principal principal);

    ResponseEntity<?> editUserCart(Principal principal, @Valid CartEditRequest editCartRequest);
}
