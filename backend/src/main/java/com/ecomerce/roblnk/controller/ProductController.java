package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.product.ProductRequest;
import com.ecomerce.roblnk.service.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/product")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailProduct(@PathVariable("id") Long id){
        var productDetail = productService.getDetailProduct(id);
        if (productDetail != null){
            return ResponseEntity.status(HttpStatus.OK).body(productDetail);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }

    //Chưa làm
    @PostMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> creatProduct(@PathVariable(value = "id", required = false) Long id, @RequestBody @Valid ProductRequest requestCreateProduct){
        var productDetail = productService.createProduct(id, requestCreateProduct);
        if (productDetail != null){
            return ResponseEntity.status(HttpStatus.OK).body(productDetail);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }



}



















