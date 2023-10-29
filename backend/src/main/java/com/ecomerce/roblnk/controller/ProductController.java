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
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ecomerce.roblnk.constants.PathConstants.*;

@RestController
@RequestMapping(API_V1_PRODUCTS)
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<?> getAllProducts(){
        return productService.getAllProduct();
    }
    @GetMapping("/product")
    public ResponseEntity<?> getProductById(@RequestParam("id") Long productId){
        return productService.findProductById(productId);
    }

    @GetMapping("/category")
    public ResponseEntity<?> getAllProductsByCategoryId(@RequestParam("id") Long categoryId,
                                                        @RequestParam(value = "pageNumber", defaultValue = "1", required = false) Integer pageNumber,
                                                        @RequestParam(value = "pageSize", defaultValue = "10", required = false) Integer pageSize){
        return productService.findProductByCategoryIdPageable(categoryId, pageNumber, pageSize);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createProduct(@RequestParam("category_id") Integer categoryId, @Valid @RequestBody CreateProductRequest request){
        return productService.createProduct(categoryId, request);
    }

    @PatchMapping("/product/id")
    public ResponseEntity<?> updateProduct(@RequestParam("id") Long productId, @Valid @RequestBody RequestProduct requestproduct){
        return productService.updateProduct(productId, requestproduct);
    }

    @DeleteMapping("/delete")
    private ResponseEntity<?> deleteProduct(@RequestParam("id") Long productId){
        return productService.deleteProduct(productId);
    }
}
