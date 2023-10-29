package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.product.RequestProduct;
import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.dto.product.CreateProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProductService {
    ResponseEntity<?> createProduct(Integer categoryId, CreateProductRequest req);
    ResponseEntity<?> deleteProduct(Long productId);
    ResponseEntity<?> updateProduct(Long productId, RequestProduct requestProduct);
    ResponseEntity<?> findProductById(Long productId);
    ResponseEntity<?> findProductByCategoryIdPageable(Long categoryId, Integer pageNumber, Integer pageSize);
    ResponseEntity<?> getAllProduct();
}
