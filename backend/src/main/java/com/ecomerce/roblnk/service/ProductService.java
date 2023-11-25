package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.product.ProductDetailResponse;
import com.ecomerce.roblnk.dto.product.ProductResponse;
import com.ecomerce.roblnk.dto.product.RequestProduct;
import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.dto.product.CreateProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProduct(Long categoryId);

    ProductDetailResponse getDetailProduct(Long productId);

}
