package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.product.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProduct(Long categoryId);

    ProductDetailResponsev2 getDetailProduct(Long productId);

    String createProduct(@Valid ProductRequest request);

    String createProductFromCategory(Long id, ProductRequest request);

    String editProduct(ProductEditRequest productEditRequest);

    String deleteProduct(@Valid ProductDeleteRequest productDeleteRequest);

    List<ProductResponse> getAllProductV2();
}
