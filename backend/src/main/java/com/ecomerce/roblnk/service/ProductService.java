package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.dto.product.CreateProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    Product createProduct(CreateProductRequest req);

    //    Product createProduct(CreateProductRequest req);
    String deleteProduct(Long productId) throws ProductException;
    Product updateProduct(Long productId, Product req) throws ProductException;
    Product findProductById(Long productid) throws ProductException;
    List<Product> findProductByCategory(String category);
    Page<Product> getAllProduct(String category, List<String> colors, List<String> sizes, Integer minPrice,
                                       Integer maxPrice, Integer minDiscount, String sort, String stock,
                                       Integer pageNumber, Integer pageSize);
}
