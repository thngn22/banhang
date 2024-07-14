package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.voucher.ApplyVoucherRequest;
import com.ecomerce.roblnk.dto.voucher.EditVoucherRequest;
import com.ecomerce.roblnk.dto.voucher.FilterVoucherRequest;
import com.ecomerce.roblnk.dto.voucher.VoucherRequest;
import com.ecomerce.roblnk.exception.InputFieldException;
import com.ecomerce.roblnk.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/voucher")
public class VoucherController {

    private final VoucherService voucherService;
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllVouchersForAdmin(FilterVoucherRequest filterVoucherRequest) {
        var saleResponses = voucherService.getListVouchers(filterVoucherRequest);
        if (saleResponses != null){
            return ResponseEntity.ok(saleResponses);
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found anything!");
    }
    @GetMapping("/")
    public ResponseEntity<?> getAllVouchers() {
        var saleResponses = voucherService.getListVouchersForAll();
        if (saleResponses != null){
            return ResponseEntity.ok(saleResponses);
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found anything!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVoucherDetail(@PathVariable(name = "id") Long id) {
        var saleResponses = voucherService.getVoucherDetail(id);
        if (saleResponses != null){
            return ResponseEntity.ok(saleResponses);
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found anything!");
    }
    @PostMapping("/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> createVoucher(@RequestBody VoucherRequest voucherRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        var voucher = voucherService.createVoucher(voucherRequest);
        if (voucher.startsWith("Success")){
            return ResponseEntity.ok(voucher);
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(voucher);
    }
    @PostMapping("/apply")
    @PreAuthorize("hasAnyRole('ROLE_ADMINISTRATOR', 'ROLE_USER')")
    public ResponseEntity<?> applyVoucher(@RequestBody ApplyVoucherRequest applyVoucherRequest, Principal principal) {
        return voucherService.applyVoucher(applyVoucherRequest, principal);
    }
    @PostMapping("/revoke")
    @PreAuthorize("hasAnyRole('ROLE_ADMINISTRATOR', 'ROLE_USER')")
    public ResponseEntity<?> revokeVoucher(@RequestParam Long cartId, Principal principal) {
        return voucherService.revokeVoucher(cartId, principal);
    }
    @PutMapping("/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> editVoucher(@RequestBody EditVoucherRequest editVoucherRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        var saleResponses = voucherService.editVoucher(editVoucherRequest);
        if (saleResponses != null){
            return ResponseEntity.ok(saleResponses);
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found anything!");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> deleteVoucher(@PathVariable(name = "id") Long id) {
        var saleResponses = voucherService.deleteVoucher(id);
        if (saleResponses != null){
            return ResponseEntity.ok(saleResponses);
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found anything!");
    }


}
