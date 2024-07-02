package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.sale.EditFlashSaleRequest;
import com.ecomerce.roblnk.dto.sale.FlashSaleRequest;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/sale")
public class SaleController {

    private final SaleService saleService;

    @GetMapping("/")
    public ResponseEntity<?> getAllFlashSales() {
        var saleResponses = saleService.getSaleResponses();
        if (saleResponses != null){
            return ResponseEntity.ok(saleResponses);
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found anything!");
    }
    @GetMapping("")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getDetailFlashSale(@RequestParam(name = "id") Long id) {
        var saleResponses = saleService.getSaleResponseDetail(id);
        if (saleResponses != null){
            return ResponseEntity.ok(saleResponses);
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found anything!");
    }
    @PostMapping(value = "/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> createFlashSale(@RequestBody FlashSaleRequest flashSaleRequest) {
        var sale = saleService.creatFlashSale(flashSaleRequest);
        if (sale.startsWith("Successfully")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                    .statusCode(201)
                    .message(String.valueOf(HttpStatus.CREATED))
                    .description(sale)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                    .statusCode(404)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description(sale)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }
    }
    @PutMapping(value = "/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> editFlashSale(@RequestBody EditFlashSaleRequest editFlashSaleRequest) {
        var sale = saleService.editFlashSale(editFlashSaleRequest);
        if (sale.startsWith("Successfully")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                    .statusCode(201)
                    .message(String.valueOf(HttpStatus.CREATED))
                    .description(sale)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                    .statusCode(404)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description(sale)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> deleteSale(@PathVariable("id") Long id) {
        var productDetail = saleService.deleteSale(id);
        if (productDetail.startsWith("Successfully")) {
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.builder()
                    .statusCode(200)
                    .message(String.valueOf(HttpStatus.OK))
                    .description(productDetail)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                    .statusCode(404)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description(productDetail)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }
    }
}
