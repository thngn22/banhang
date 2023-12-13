package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.model.ProductItem;
import com.ecomerce.roblnk.repository.ProductItemRepository;
import com.ecomerce.roblnk.service.ProductItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IProductItemService implements ProductItemService {
    private final ProductItemRepository productItemRepository;
    @Override
    public List<?> getAllProductItem() {
        return productItemRepository.findAll();
    }

    @Override
    public ProductItem getProductItem(Long id) {
        return productItemRepository.findById(id).orElseThrow();
    }
}
