package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.product.*;
import jakarta.validation.Valid;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProduct(Long categoryId);
    PageProductResponse getAllProductFilter(Long categoryId, List<String> size, List<String> color, String minPrice, String maxPrice, String search, String sort, Integer pageNumber);

    ProductDetailResponsev3 getDetailProductForAdmin(Long productId);
    ProductDetailResponsev2 getDetailProduct(Long productId);

    String createProduct(@Valid ProductRequest request);

    String createProductFromCategory(Long id, ProductRequest request);

    String editProduct(ProductEditRequest productEditRequest);

    String deleteProduct(Long productDeleteRequest);

    List<ProductResponse> getAllProductV2();

    List<ProductResponse> getAllProductV3();
    String getURLPictureAndUploadToCloudinary(String base64Content);
}
