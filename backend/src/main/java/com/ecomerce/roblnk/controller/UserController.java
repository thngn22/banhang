package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.user.EditUserProfileRequest;
import com.ecomerce.roblnk.dto.user.UserAddressRequest;
import com.ecomerce.roblnk.dto.user.UserPaymentRequest;
import com.ecomerce.roblnk.dto.user.UserUpdateAddressRequest;
import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.service.UserService;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/account/payment")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> payment(Principal connectedUser){
        return userService.getUserPayment(connectedUser);
    }

    @PostMapping("/account/payment")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> addPayment(Principal connectedUser, @RequestBody UserPaymentRequest request){
        return userService.addUserPayment(connectedUser, request);
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

    @GetMapping("/account/order/")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getOrderHistory(Principal connectedUser){
        return userService.getUserHistoryOrder(connectedUser);
    }

}
