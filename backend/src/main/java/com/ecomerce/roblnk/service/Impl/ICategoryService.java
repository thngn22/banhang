package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.category.CategoryResponse;
import com.ecomerce.roblnk.dto.category.CreateCategoryRequest;
import com.ecomerce.roblnk.dto.category.EditCategoryRequest;
import com.ecomerce.roblnk.dto.category.VariationRequest;
import com.ecomerce.roblnk.dto.variationOption.VariationOptionResponse;
import com.ecomerce.roblnk.mapper.CategoryMapper;
import com.ecomerce.roblnk.mapper.VariationMapper;
import com.ecomerce.roblnk.mapper.VariationOptionMapper;
import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.model.Variation;
import com.ecomerce.roblnk.model.VariationOption;
import com.ecomerce.roblnk.repository.CategoryRepository;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.repository.VariationOptionRepository;
import com.ecomerce.roblnk.repository.VariationRepository;
import com.ecomerce.roblnk.service.CategoryService;
import com.ecomerce.roblnk.service.ProductService;
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
    private final ProductRepository productRepository;

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
        categoryRepository.findAllByParentCategoryId_Id(null).forEach(category -> cate.add(category.getId()));
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
        categoryRepository.findAllByParentCategoryId_Id(null).forEach(category -> cate.add(category.getId()));

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

    @Override
    public String createCategory(CreateCategoryRequest request) {
        var parentCategory = categoryRepository.findById(request.getParentCategoryId());
        Category category = new Category();
        if (parentCategory.isPresent()){
            category.setParentCategoryId(parentCategory.get());
        }
        else {
            category.setParentCategoryId(null);
        }
        category.setName(request.getName());
        category.setActive(true);
        categoryRepository.save(category);
        return "Successfully created new category!";
    }

    @Override
    public String editCategory(EditCategoryRequest request) {
        var category = categoryRepository.findById(request.getId());
        if (category.isPresent()) {
            if (request.getName() != null && !request.getName().equals(category.get().getName())) {
                category.get().setName(request.getName());
            }

            if (request.getParentCategoryId() == null || !request.getParentCategoryId().equals(category.get().getParentCategoryId().getId())) {
                var newCategory = categoryRepository.findById(request.getId());
                if (newCategory.isPresent()) {
                    category.get().setParentCategoryId(newCategory.get());
                } else {
                    category.get().setParentCategoryId(null);
                }
            }
            return "Successfully updated category";
        }
        else return "Fail to update the category information, please try again!";

    }

    @Override
    public String deleteCategory(Long id) {
        var category = categoryRepository.findById(id);
        if (category.isPresent()) {
            var products = productRepository.findAllByCategoryId(id);
            boolean flag = true;
            if (!products.isEmpty()) {
                for (Product product : products) {
                    if (product.isActive()) {
                        flag = false;
                        break;
                    }
                }
            }

            if (flag){
                category.get().setActive(false);
                return "Successfully de-active category";
            }
            else {
                return "Category exist product that is active, please try to de-active product first!";
            }
        }
        else return "Not found any category!";    }
}
