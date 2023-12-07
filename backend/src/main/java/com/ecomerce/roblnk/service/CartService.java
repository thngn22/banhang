package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.cart.CheckoutRequest;
import com.ecomerce.roblnk.dto.cart.UserCart;
import com.ecomerce.roblnk.dto.cartItem.CartItemEditRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.List;

public interface CartService {

    ResponseEntity<?> getUserCart(Principal principal);
    UserCart getUserCartv2(Principal principal);

    ResponseEntity<?> editUserCart(Principal principal, @Valid List<CartItemEditRequest> list);

    String checkoutCart(Principal principal, CheckoutRequest list);
}
