package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/voucher")
public class VoucherController {
    private final VoucherService voucherService;
    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllVouchers() {
        var saleResponses = voucherService.getListVouchers();
        if (saleResponses != null){
            return ResponseEntity.ok(saleResponses);
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found anything!");
    }
}
