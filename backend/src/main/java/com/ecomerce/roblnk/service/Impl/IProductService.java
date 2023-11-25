package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.product.ProductDetailResponse;
import com.ecomerce.roblnk.dto.product.ProductResponse;
import com.ecomerce.roblnk.mapper.ProductMapper;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IProductService implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;


    @Override
    public List<ProductResponse> getAllProduct(Long categoryId) {
        var listProduct = productRepository.findAllByCategoryId(categoryId);
        return productMapper.toProductResponseList(listProduct);
    }

    @Override
    public ProductDetailResponse getDetailProduct(Long productId) {
        var product = productRepository.findById(productId);
        return product.map(productMapper::toDetailResponse).orElse(null);
    }


}