package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.category.CategoryResponse;
import com.ecomerce.roblnk.dto.category.VariationRequest;
import com.ecomerce.roblnk.mapper.CategoryMapper;
import com.ecomerce.roblnk.mapper.VariationMapper;
import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.model.Variation;
import com.ecomerce.roblnk.repository.CategoryRepository;
import com.ecomerce.roblnk.repository.VariationRepository;
import com.ecomerce.roblnk.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ICategoryService implements CategoryService {
    private final CategoryMapper categoryMapper;
    private final VariationMapper variationMapper;
    private final CategoryRepository categoryRepository;
    private final VariationRepository variationRepository;

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


}
