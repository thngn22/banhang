package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.cart.CheckoutRequest;
import com.ecomerce.roblnk.dto.cartItem.CartItemEditRequest;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.service.CartService;
import com.ecomerce.roblnk.service.DeliveryService;
import com.ecomerce.roblnk.service.PaymentMethodService;
import com.ecomerce.roblnk.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final UserService userService;
    private final DeliveryService deliveryService;
    private final PaymentMethodService paymentMethodService;

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

    @PostMapping("/checkout")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> checkout(Principal principal, @RequestBody @Valid CheckoutRequest list) {
        var cartCheckout = cartService.checkoutCart(principal, list);
        if (cartCheckout.startsWith("Not")){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ErrorResponse.builder()
                            .statusCode(403)
                            .message("Not thing to check out, please add shoes to cart first!")
                            .description("Not thing to check out, please add shoes to cart first!")
                            .timestamp(new Date(System.currentTimeMillis()))
                            .build()
            );
        }
        else if (cartCheckout.startsWith("Product")){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ErrorResponse.builder()
                            .statusCode(403)
                            .message("Product is not added to cart, please add shoes first!")
                            .description("Product is not added to cart, please add shoes first!")
                            .timestamp(new Date(System.currentTimeMillis()))
                            .build()
            );
        }
        else if (cartCheckout.startsWith("Bad")){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ErrorResponse.builder()
                            .statusCode(400)
                            .message("Bad request, please login first!")
                            .description("Bad request, please login first!")
                            .timestamp(new Date(System.currentTimeMillis()))
                            .build()
            );
        }
        else
        return ResponseEntity.status(HttpStatus.OK).body(cartCheckout);

    }

    @GetMapping("/delivery")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllDelivery(Principal principal) {
        var deliveries = deliveryService.getAllDelivery(principal);
        return ResponseEntity.status(HttpStatus.OK).body(deliveries);
    }

    @GetMapping("/payment_method")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllPaymentMethod(Principal principal) {
        var paymentMethods = paymentMethodService.getAllPaymentMethod(principal);
        return ResponseEntity.status(HttpStatus.OK).body(paymentMethods);

    }



}
