package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.service.UserService;
import com.ecomerce.roblnk.service.VariationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {
    private final UserService userService;
    private final VariationService variationService;
    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> findUserById(@PathVariable("id") Long id) throws UserException {
        var user = userService.findUserById(id);
        if (user != null){
            return ResponseEntity.ok(user);
        }
        else return ResponseEntity.status(HttpStatusCode.valueOf(404)).body("Not found any user!");
    }
    @GetMapping("/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getListUser(){
        var list =  userService.getAllUsers();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/users/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> deActiveOrActiveUser(Principal connectedUser, @PathVariable("id") Long id){
        return userService.deActiveOrActiveUser(connectedUser, id);
    }



}
