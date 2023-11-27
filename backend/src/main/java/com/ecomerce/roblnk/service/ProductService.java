package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.product.*;
import jakarta.validation.Valid;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProduct(Long categoryId);

    ProductDetailResponse getDetailProduct(Long productId);

    String createProduct(Long id, @Valid ProductRequest request);
}
