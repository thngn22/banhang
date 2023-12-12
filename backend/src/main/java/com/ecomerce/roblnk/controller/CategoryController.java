package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.category.VariationRequest;
import com.ecomerce.roblnk.dto.product.ProductRequest;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.exception.InputFieldException;
import com.ecomerce.roblnk.service.CategoryService;
import com.ecomerce.roblnk.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/category")
public class CategoryController {
    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping("")
    public ResponseEntity<?> getAllProductInCategory(@RequestParam(value = "category_id", required = false) Long categoryId){
        var productDetail = productService.getAllProduct(categoryId);
        if (productDetail != null){
            return ResponseEntity.status(HttpStatus.OK).body(productDetail);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }

    @PostMapping("/{id}/products")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> addProductToCategory(@PathVariable("id") Long id, @RequestBody @Valid ProductRequest request, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        var productDetail = productService.createProductFromCategory(id, request);
        if (productDetail.startsWith("Successfull")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                    .statusCode(200)
                    .message(String.valueOf(HttpStatus.CREATED))
                    .description(productDetail)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else if (productDetail.startsWith("Thi")) {
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

    @GetMapping("/all")
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

/*    @PostMapping("/{id}/variation")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> addVariationIntoCategory(@PathVariable("id") Long id, @RequestBody List<String> variationRequest){
        try {
            var listVariation = categoryService.addVariationIntoCategory(id, variationRequest);
            if (listVariation != null){
                return ResponseEntity.status(HttpStatus.OK).body(listVariation);
            }
            else
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any variation!");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponse.builder()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .description(e.getLocalizedMessage())
                    .message(e.getMessage())
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }
    }*/

    @GetMapping("/size")
    public ResponseEntity<?> getAllSizeInCategory(@RequestParam(value = "category_id", required = false) Long categoryId){
        var listVariation = categoryService.getAllSizeInCategory(categoryId);
        if (listVariation != null){
            return ResponseEntity.status(HttpStatus.OK).body(listVariation);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any size!");
    }
    @GetMapping("/color")
    public ResponseEntity<?> getAllColorInCategory(@RequestParam(value = "category_id", required = false) Long categoryId){
        var listVariation = categoryService.getAllColorInCategory(categoryId);
        if (listVariation != null){
            return ResponseEntity.status(HttpStatus.OK).body(listVariation);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any color!");
    }
}
