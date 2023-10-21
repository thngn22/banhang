package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ecomerce.roblnk.constants.PathConstants.*;

@RestController
@RequestMapping(API_V1_PRODUCTS)
@AllArgsConstructor
public class ProductController {

    private ProductService productService;

    @GetMapping()
    public ResponseEntity<Page<Product>> findProductByCategoryHandler(
            @RequestParam String category,      @RequestParam List<String> color,
            @RequestParam List<String> size,    @RequestParam Integer minPrice,
            @RequestParam Integer maxPrice,     @RequestParam Integer minDiscount,
            @RequestParam String sort,          @RequestParam String stock,
            @RequestParam Integer pageNumber,   @RequestParam Integer pageSize){

        Page<Product> response = productService.getAllProduct(category, color, size, minPrice, maxPrice, minDiscount,
                sort,stock, pageNumber, pageSize);
        System.out.println("Complete products");

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @GetMapping("/id/{productId}")
    public ResponseEntity<Product> findProductByIdHandler(@PathVariable Long productId) throws ProductException{

        Product product = productService.findProductById(productId);
        return new ResponseEntity<Product>(product, HttpStatus.ACCEPTED);
    }

    /*public ResponseEntity<List<Product>> searchProductHandler(@RequestParam String searchString){
        List<Product> products = productService.searchProduct(searchString);

        return new ResponseEntity<List<Product>>(products, HttpStatus.OK);
    }*/
}
