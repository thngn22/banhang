package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.service.OrderService;
import com.ecomerce.roblnk.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Date;

import static com.ecomerce.roblnk.constants.ErrorMessage.EMAIL_NOT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/order")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllOrders(Principal connectedUser){
        var orders = orderService.getAllOrder(connectedUser);
        if (orders != null){
            return ResponseEntity.status(HttpStatus.OK).body(orders);
        }
        else return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(ErrorResponse.builder()
                .statusCode(404)
                .message(String.valueOf(HttpStatus.NOT_FOUND))
                .description(EMAIL_NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis()))
                .build());
    }
}
