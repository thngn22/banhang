package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.cart.CheckoutRequest;
import com.ecomerce.roblnk.dto.cart.UserCart;
import com.ecomerce.roblnk.dto.cartItem.CartItemEditRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.net.URISyntaxException;
import java.security.Principal;
import java.util.List;

public interface CartService {
    ResponseEntity<?> getUserCart(Principal principal);
    UserCart getUserCartv2(Principal principal);

    ResponseEntity<?> editUserCart(Principal principal, @Valid List<CartItemEditRequest> list);

    ResponseEntity<?> checkoutCart(Principal principal, CheckoutRequest list, HttpServletRequest request, RedirectAttributes redirectAttributes) throws URISyntaxException;
}
