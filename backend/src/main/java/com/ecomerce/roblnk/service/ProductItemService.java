package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.model.ProductItem;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProductItemService {
    List<?> getAllProductItem();
    ProductItem getProductItem(Long id);
}
