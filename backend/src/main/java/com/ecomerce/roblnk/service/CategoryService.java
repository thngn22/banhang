package com.ecomerce.roblnk.service;

import java.util.List;
import java.util.Map;

public interface CategoryService {
    List<?> getAllCategory();

    List<?> getAllChildCategory(Long id);

    List<?> getNonNestedCategory(Long id);
}
