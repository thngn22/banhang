package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.product.ProductDeleteRequest;
import com.ecomerce.roblnk.dto.product.ProductRequest;
import com.ecomerce.roblnk.dto.product.ProductEditRequest;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.service.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api/v1/product")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailProduct(@PathVariable("id") Long id) {
        var productDetail = productService.getDetailProduct(id);
        if (productDetail != null) {
            return ResponseEntity.status(HttpStatus.OK).body(productDetail);
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }
    @GetMapping("/")
    public ResponseEntity<?> getAllProductForUser() {
        var product = productService.getAllProductV3();
        if (product != null) {
            return ResponseEntity.status(HttpStatus.OK).body(product);
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> createProduct(@RequestBody @Valid ProductRequest requestCreateProduct) {
        var productDetail = productService.createProduct(requestCreateProduct);
        if (productDetail.startsWith("Successfully")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                    .statusCode(201)
                    .message(String.valueOf(HttpStatus.CREATED))
                    .description(productDetail)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else if (productDetail.startsWith("This")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                    .statusCode(403)
                    .message(String.valueOf(HttpStatus.FORBIDDEN))
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

    @PutMapping("/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> editProduct(@RequestBody @Valid ProductEditRequest productEditRequest) {
        var productDetail = productService.editProduct(productEditRequest);
        if (productDetail.startsWith("Successfully")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                    .statusCode(201)
                    .message(String.valueOf(HttpStatus.CREATED))
                    .description(productDetail)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else if (productDetail.startsWith("This")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                    .statusCode(403)
                    .message(String.valueOf(HttpStatus.FORBIDDEN))
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

    @DeleteMapping("/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> deleteProduct(@RequestBody @Valid ProductDeleteRequest productDeleteRequest) {
        var productDetail = productService.deleteProduct(productDeleteRequest);
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



















