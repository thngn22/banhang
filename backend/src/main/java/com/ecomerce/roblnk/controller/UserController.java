package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.user.EditUserProfileRequest;
import com.ecomerce.roblnk.dto.user.UserAddressRequest;
import com.ecomerce.roblnk.dto.user.UserPaymentRequest;
import com.ecomerce.roblnk.dto.user.UserUpdateAddressRequest;
import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/account/profile")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> information(Principal connectedUser){
        return userService.findInformationUser(connectedUser);

    }
    @PutMapping("/account/profile")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> editInformation(Principal connectedUser, @RequestBody EditUserProfileRequest request){
        return userService.editInformation(connectedUser, request);
    }

    @GetMapping("/account/address")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> address(Principal connectedUser){
        return userService.getUserAddress(connectedUser);
    }

    @PostMapping("/account/address")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> addAddress(Principal connectedUser, @RequestBody UserAddressRequest userAddressRequest){
        return userService.addUserAddress(connectedUser, userAddressRequest);
    }

    @PutMapping("/account/address/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> updateAddress(Principal connectedUser, @PathVariable("id") Long id,  @RequestBody UserAddressRequest userUpdateAddressRequest){
        return userService.updateUserAddress(connectedUser, id, userUpdateAddressRequest);
    }

    @DeleteMapping("/account/address/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> deleteAddress(Principal connectedUser, @PathVariable("id") Long id){
        return userService.deleteUserAddress(connectedUser, id);
    }

    @GetMapping("/account/orders/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getDetailOrderHistoryById(Principal connectedUser, @PathVariable("id") Long id){
        var userOrders = userService.getUserHistoryOrderForUser(connectedUser, id);
        if (userOrders != null) {
            return ResponseEntity.status(HttpStatus.OK).body(userOrders);
        } else
            return ResponseEntity.status(HttpStatus.OK).body("Did not found any orders!");
    }
    @GetMapping("/account/orders")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getListOrderHistory(Principal connectedUser){
        var userOrders = userService.getAllUserHistoryOrders(connectedUser);
        if (userOrders != null) {
            return ResponseEntity.status(HttpStatus.OK).body(userOrders);
        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission to access this resource!");
    }


}
