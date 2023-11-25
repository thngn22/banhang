package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.service.CategoryService;
import com.ecomerce.roblnk.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/category")
public class CategoryController {
    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping("/{id}/products")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllProductInCategory(@PathVariable("id") Long id){
        var productDetail = productService.getAllProduct(id);
        if (productDetail != null){
            return ResponseEntity.status(HttpStatus.OK).body(productDetail);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }

    @GetMapping("/")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllTreeCategory(){
         var listCate = categoryService.getAllCategory();
        if (listCate != null){
            return ResponseEntity.status(HttpStatus.OK).body(listCate);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllTreeCategoryFromThisCategory(@PathVariable("id") Long id){
        var listCate = categoryService.getAllChildCategory(id);
        if (listCate != null){
            return ResponseEntity.status(HttpStatus.OK).body(listCate);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }
    @GetMapping("/{id}/nested")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getNonNestedCategoryFromThisCategory(@PathVariable("id") Long id){
        var listCate = categoryService.getNonNestedCategory(id);
        if (listCate != null){
            return ResponseEntity.status(HttpStatus.OK).body(listCate);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }
}
