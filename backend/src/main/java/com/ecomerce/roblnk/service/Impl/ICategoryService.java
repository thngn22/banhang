package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.category.CategoryResponse;
import com.ecomerce.roblnk.mapper.CategoryMapper;
import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.repository.CategoryRepository;
import com.ecomerce.roblnk.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ICategoryService implements CategoryService {
    private final CategoryMapper categoryMapper;

    private final CategoryRepository categoryRepository;
    @Override
    public List<?> getAllCategory() {
        var listCate = categoryRepository.findAllByParentCategoryId_Id(null);
        return categoryMapper.toCategoryResponses(listCate);
    }

    @Override
    public List<?> getAllChildCategory(Long id) {
        var listCate = categoryRepository.findAllByParentCategoryId_Id(id);
        return categoryMapper.toCategoryResponses(listCate);
    }

    @Override
    public List<?> getNonNestedCategory(Long id) {
        var listCate = categoryRepository.findAllByParentCategoryId_Id(id);
        return categoryMapper.toNonNestedCategoryResponses(listCate);

    }


}
