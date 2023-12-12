package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.category.VariationRequest;

import java.util.List;

public interface CategoryService {
    List<?> getAllCategory();

    List<?> getAllChildCategory(Long id);

    List<?> getNonNestedCategory(Long id);

    List<?> addVariationIntoCategory(Long id, List<String> variationRequest);

    List<?> getVariationInCategory(Long id);

    List<?> getAllSizeInCategory(Long categoryId);

    Object getAllColorInCategory(Long categoryId);
}
