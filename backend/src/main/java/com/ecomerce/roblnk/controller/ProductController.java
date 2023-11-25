package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.product.CreateProductRequest;
import com.ecomerce.roblnk.dto.product.RequestProduct;
import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.service.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ecomerce.roblnk.constants.PathConstants.*;

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
}
