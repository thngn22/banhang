package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.category.CreateCategoryRequest;
import com.ecomerce.roblnk.dto.category.EditCategoryRequest;
import com.ecomerce.roblnk.dto.product.ProductRequest;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.exception.InputFieldException;
import com.ecomerce.roblnk.service.CategoryService;
import com.ecomerce.roblnk.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

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
    @GetMapping("/with_out_flash_sale_edit")
    @PreAuthorize("hasAnyRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllProductInCategoryWithOutFlashSaleToEdit(@RequestParam(value = "category_id", required = false) Long categoryId,
                                                                     @RequestParam(value = "sale_id") Long sale_id,
                                                                     @RequestParam(value = "page_number", required = false, defaultValue = "1") Integer pageNumber
                                                                     ){
        var productDetail = productService.getAllProductWithOutFlashSale(categoryId, sale_id, pageNumber);
        if (productDetail != null){
            return ResponseEntity.status(HttpStatus.OK).body(productDetail);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }
    @GetMapping("/with_out_flash_sale_create")
    @PreAuthorize("hasAnyRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllProductInCategoryWithOutFlashSaleToCreate(@RequestParam(value = "category_id", required = false) Long categoryId,
                                                                           @RequestParam(value = "page_number", required = false, defaultValue = "1") Integer pageNumber
    ){
        var productDetail = productService.getAllProductWithOutFlashSaleCreate(categoryId, pageNumber);
        if (productDetail != null){
            return ResponseEntity.status(HttpStatus.OK).body(productDetail);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }
    @PostMapping(value = "/{id}/products", consumes = {"multipart/form-data"})
    @PreAuthorize("hasAnyRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> addProductToCategory(@PathVariable("id") Long id, @RequestBody @Valid ProductRequest request,
                                                  @RequestPart("file") @Valid @NotNull MultipartFile[] files,
                                                  BindingResult bindingResult) {
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        var productDetail = productService.createProductFromCategory(id, request, files);
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

    @PostMapping("/")
    public ResponseEntity<?> createCategory(CreateCategoryRequest request){
        var response = categoryService.createCategory(request);
        if (response.startsWith("Successfully")) {
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.builder()
                    .statusCode(200)
                    .message(String.valueOf(HttpStatus.OK))
                    .description(response)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                    .statusCode(404)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description(response)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }
    }

    @PutMapping("/")
    public ResponseEntity<?> editCategory(@RequestBody EditCategoryRequest request, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        var response = categoryService.editCategory(request);
        if (response.startsWith("Successfully")) {
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.builder()
                    .statusCode(200)
                    .message(String.valueOf(HttpStatus.OK))
                    .description(response)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else {
            if (response.startsWith("This")) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponse.builder()
                        .statusCode(400)
                        .message(String.valueOf(HttpStatus.BAD_REQUEST))
                        .description(response)
                        .timestamp(new Date(System.currentTimeMillis()))
                        .build());
            }
            else
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                        .statusCode(404)
                        .message(String.valueOf(HttpStatus.NOT_FOUND))
                        .description(response)
                        .timestamp(new Date(System.currentTimeMillis()))
                        .build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> disableCategory(@PathVariable(name = "id") Long id){
        var response = categoryService.deleteCategory(id);
        if (response.startsWith("Successfully")) {
            return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.builder()
                    .statusCode(200)
                    .message(String.valueOf(HttpStatus.OK))
                    .description(response)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else {
            if (response.startsWith("Category")) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponse.builder()
                        .statusCode(404)
                        .message(String.valueOf(HttpStatus.BAD_REQUEST))
                        .description(response)
                        .timestamp(new Date(System.currentTimeMillis()))
                        .build());
            }
            else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                    .statusCode(404)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description(response)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }
    }
}
