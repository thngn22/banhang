package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.category.CategoryResponse;
import com.ecomerce.roblnk.dto.category.VariationRequest;
import com.ecomerce.roblnk.dto.variationOption.VariationOptionResponse;
import com.ecomerce.roblnk.mapper.CategoryMapper;
import com.ecomerce.roblnk.mapper.VariationMapper;
import com.ecomerce.roblnk.mapper.VariationOptionMapper;
import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.model.Variation;
import com.ecomerce.roblnk.model.VariationOption;
import com.ecomerce.roblnk.repository.CategoryRepository;
import com.ecomerce.roblnk.repository.VariationOptionRepository;
import com.ecomerce.roblnk.repository.VariationRepository;
import com.ecomerce.roblnk.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ICategoryService implements CategoryService {
    private final CategoryMapper categoryMapper;
    private final VariationMapper variationMapper;
    private final CategoryRepository categoryRepository;
    private final VariationRepository variationRepository;
    private final VariationOptionRepository variationOptionRepository;
    private final VariationOptionMapper variationOptionMapper;

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

    @Override
    public List<?> addVariationIntoCategory(Long id, List<String> variationRequest) {
        var cate = categoryRepository.findById(id);
        if (cate.isPresent()) {
            var variations = variationRepository.findVariationsByCategory_Id(id);
            while (!variationRequest.isEmpty()) {
                boolean flag = true;
                for (Variation variation : variations) {
                    if (variationRequest.get(0).equals(variation.getName())) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    var newVariation = new Variation();
                    newVariation.setName(variationRequest.get(0));
                    newVariation.setCategory(cate.get());
                    variations.add(newVariation);
                }
                variationRequest.remove(0);
            }
            variationRepository.saveAll(variations);
            return variationMapper.toVariationResponses(variations);
        } else
            return null;
    }

    @Override
    public List<?> getVariationInCategory(Long id) {
        var cate = categoryRepository.findById(id);
        if (cate.isPresent()) {
            var variations = variationRepository.findVariationsByCategory_Id(id);
            return variationMapper.toVariationResponses(variations);
        } else
            return null;
    }

    @Override
    public List<?> getAllSizeInCategory(Long categoryId) {
        List<Category> categories = new ArrayList<>();
        List<Category> categoryList = new ArrayList<>();
        List<Long> cate = new ArrayList<>();
        cate.add(1L);
        cate.add(2L);
        cate.add(21L);
        cate.add(22L);
        var cates = categoryRepository.findAll();
        if (categoryId == null){
            categories.addAll(categoryRepository.findAllById(cate));
        }
        else
            categories.add(categoryRepository.findById(categoryId).orElseThrow());
        while (!categories.isEmpty()) {
            Long id = categories.get(0).getId();
            boolean flag = false;
            for (Category category : cates) {
                if (category.getParentCategoryId() != null && category.getParentCategoryId().getId().equals(id)) {
                    flag = true;
                    categories.add(category);
                }
            }
            if (flag) {
                categories.remove(0);
            } else {
                categoryList.add(categories.get(0));
                categories.remove(0);
            }
        }
        List<VariationOptionResponse> variationOptionResponses = new ArrayList<>();
        for (Category category : categoryList) {
            Long variationId = null;
            var variations = variationRepository.findVariationsByCategory_Id(category.getId());
            if (variations.get(0).getName().startsWith("K")) {
                variationId = variations.get(0).getId();
            } else if (variations.get(1).getName().startsWith("K")) {
                variationId = variations.get(1).getId();
            }
            var variationOptions = variationOptionRepository.findAllByVariation_Id(variationId);
            variationOptionResponses.addAll(variationOptionMapper.toVariationOptionResponses(variationOptions));
        }
        variationOptionResponses.sort(Comparator.comparing(VariationOptionResponse::getValue));
        return variationOptionResponses.stream().map(VariationOptionResponse::getValue).distinct().collect(Collectors.toList());
    }

    @Override
    public Object getAllColorInCategory(Long categoryId) {
        List<Category> categories = new ArrayList<>();
        List<Category> categoryList = new ArrayList<>();
        List<Long> cate = new ArrayList<>();
        cate.add(1L);
        cate.add(2L);
        cate.add(21L);
        cate.add(22L);
        var cates = categoryRepository.findAll();
        if (categoryId == null){
            categories.addAll(categoryRepository.findAllById(cate));
        }
        else
            categories.add(categoryRepository.findById(categoryId).orElseThrow());
        while (!categories.isEmpty()) {
            Long id = categories.get(0).getId();
            boolean flag = false;
            for (Category category : cates) {
                if (category.getParentCategoryId() != null && category.getParentCategoryId().getId().equals(id)) {
                    flag = true;
                    categories.add(category);
                }
            }
            if (flag) {
                categories.remove(0);
            } else {
                categoryList.add(categories.get(0));
                categories.remove(0);
            }
        }
        List<VariationOptionResponse> variationOptionResponses = new ArrayList<>();
        for (Category category : categoryList) {
            Long variationId = null;
            var variations = variationRepository.findVariationsByCategory_Id(category.getId());
            if (variations.get(0).getName().startsWith("M")) {
                variationId = variations.get(0).getId();
            } else if (variations.get(1).getName().startsWith("M")) {
                variationId = variations.get(1).getId();
            }
            var variationOptions = variationOptionRepository.findAllByVariation_Id(variationId);
            variationOptionResponses.addAll(variationOptionMapper.toVariationOptionResponses(variationOptions));
        }
        variationOptionResponses.sort(Comparator.comparing(VariationOptionResponse::getValue));
        return variationOptionResponses.stream().map(VariationOptionResponse::getValue).distinct().collect(Collectors.toList());

    }


}
