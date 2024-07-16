package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.product.ProductRequest;
import com.ecomerce.roblnk.dto.product.ProductEditRequest;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.exception.InputFieldException;
import com.ecomerce.roblnk.service.ProductService;
import com.ecomerce.roblnk.service.RecommendService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/product")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final RecommendService recommendService;
    @GetMapping("/search")
    public ResponseEntity<?> getAllFilterProduct(@RequestParam(value = "category_id", required = false) Long categoryId,
                                                 @RequestParam(value = "product_id", required = false) Long productId,
                                                 @RequestParam(value = "size", required = false) List<String> size,
                                                 @RequestParam(value = "color", required = false) List<String> color,
                                                 @RequestParam(value = "min_price", required = false) String minPrice,
                                                 @RequestParam(value = "max_price", required = false) String maxPrice,
                                                 @RequestParam(value = "search", required = false) String search,
                                                 @RequestParam(value = "sort", required = false, defaultValue = "rating_desc") String sort,
                                                 @RequestParam(value = "state", required = false) Boolean state,
                                                 @RequestParam(value = "page_number", required = false, defaultValue = "1") Integer pageNumber,
                                                 @RequestParam(value = "flag", required = false, defaultValue = "false") boolean isAdmin
    ){
        var productDetail = productService.getAllProductFilter(categoryId, productId, minPrice, maxPrice, size, color, search, sort, state, pageNumber, isAdmin);
        if (productDetail != null){
            return ResponseEntity.status(HttpStatus.OK).body(productDetail);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }

    @GetMapping("/mini_search")
    public ResponseEntity<?> getMiniSearchAllFilterProduct(@RequestParam(value = "category_id", required = false) Long categoryId,
                                                 @RequestParam(value = "product_id", required = false) Long productId,
                                                 @RequestParam(value = "size", required = false) List<String> size,
                                                 @RequestParam(value = "color", required = false) List<String> color,
                                                 @RequestParam(value = "min_price", required = false) String minPrice,
                                                 @RequestParam(value = "max_price", required = false) String maxPrice,
                                                 @RequestParam(value = "search", required = false, defaultValue = "          ") String search,
                                                 @RequestParam(value = "sort", required = false, defaultValue = "new_to_old") String sort,
                                                 @RequestParam(value = "page_number", required = false, defaultValue = "1") Integer pageNumber
    ){
        var productDetail = productService.getMiniSearchAllProductFilter(categoryId, productId, minPrice, maxPrice, size, color, search, sort, pageNumber);
        if (productDetail != null){
            return ResponseEntity.status(HttpStatus.OK).body(productDetail);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailProduct(@PathVariable("id") Long id) {
        var productDetail = productService.getDetailProduct(id);
        if (productDetail != null) {
            return ResponseEntity.status(HttpStatus.OK).body(productDetail);
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }

   /* @GetMapping("/")
    public ResponseEntity<?> getAllProductForUser() {
        var product = productService.getAllProductV3();
        if (product != null) {
            return ResponseEntity.status(HttpStatus.OK).body(product);
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }*/

    @PostMapping(value = "/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> createProduct(@ModelAttribute ProductRequest productRequest,
                                           BindingResult bindingResult) {

        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        var productDetail = productService.createProduct(productRequest);
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
                    .description("This category is not available to create product. Please try a sub-category of this category or another!  ")
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

    @PutMapping(value = "/")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> editProduct(@ModelAttribute ProductEditRequest productEditRequest) {
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

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") Long id) {
        var productDetail = productService.deleteProduct(id);
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

    @GetMapping("/carousel_rating")
    public ResponseEntity<?> getCarouselRatingForHome(){
        var productCarousel = productService.getAllProductCarouselRating();
        return ResponseEntity.status(HttpStatus.OK).body(productCarousel);
    }
    @GetMapping("/carousel_sold")
    public ResponseEntity<?> getCarouselSoldForHome(){
        var productCarousel = productService.getAllProductCarouselSold();
        return ResponseEntity.status(HttpStatus.OK).body(productCarousel);
    }
    @GetMapping("/carousel_product")
    public ResponseEntity<?> getCarouselForDetailProduct(@RequestParam("category_id") Long categoryId){
        var productCarousel = productService.getAllProductCarouselInCategory(categoryId);
        return ResponseEntity.status(HttpStatus.OK).body(productCarousel);
    }

    @GetMapping("/recommend")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getRecommendProductFromUsersReview(Principal principal, @RequestParam(value = "page_number", required = false, defaultValue = "1") Integer pageNumber){
        var recommendProducts = recommendService.getRecommendProductFromUsersReview(principal, pageNumber);
        if (recommendProducts != null) {
            return ResponseEntity.status(HttpStatus.OK).body(recommendProducts);
        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission to access this resource!");
    }
}



















