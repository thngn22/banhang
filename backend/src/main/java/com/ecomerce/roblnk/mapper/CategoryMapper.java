package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.category.NonNestedCategoryResponse;
import com.ecomerce.roblnk.dto.category.CategoryResponse;
import com.ecomerce.roblnk.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(source = "parentCategoryId.id", target = "parentCategoryId")
    CategoryResponse toCategoryResponse(Category category);
    List<CategoryResponse> toCategoryResponses(List<Category> categories);
    @Mapping(source = "parentCategoryId.id", target = "parentCategoryId")
    NonNestedCategoryResponse toNonNestedCategoryResponse(Category category);
    List<NonNestedCategoryResponse> toNonNestedCategoryResponses(List<Category> categories);

}
