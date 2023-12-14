package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.category.CategoryResponse;
import com.ecomerce.roblnk.dto.category.NonNestedCategoryResponse;
import com.ecomerce.roblnk.model.Category;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-13T02:44:53+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryResponse toCategoryResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryResponse categoryResponse = new CategoryResponse();

        categoryResponse.setParentCategoryId( categoryParentCategoryIdId( category ) );
        categoryResponse.setId( category.getId() );
        categoryResponse.setName( category.getName() );
        categoryResponse.setCategories( toCategoryResponses( category.getCategories() ) );

        return categoryResponse;
    }

    @Override
    public List<CategoryResponse> toCategoryResponses(List<Category> categories) {
        if ( categories == null ) {
            return null;
        }

        List<CategoryResponse> list = new ArrayList<CategoryResponse>( categories.size() );
        for ( Category category : categories ) {
            list.add( toCategoryResponse( category ) );
        }

        return list;
    }

    @Override
    public NonNestedCategoryResponse toNonNestedCategoryResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        NonNestedCategoryResponse nonNestedCategoryResponse = new NonNestedCategoryResponse();

        nonNestedCategoryResponse.setParentCategoryId( categoryParentCategoryIdId( category ) );
        nonNestedCategoryResponse.setId( category.getId() );
        nonNestedCategoryResponse.setName( category.getName() );

        return nonNestedCategoryResponse;
    }

    @Override
    public List<NonNestedCategoryResponse> toNonNestedCategoryResponses(List<Category> categories) {
        if ( categories == null ) {
            return null;
        }

        List<NonNestedCategoryResponse> list = new ArrayList<NonNestedCategoryResponse>( categories.size() );
        for ( Category category : categories ) {
            list.add( toNonNestedCategoryResponse( category ) );
        }

        return list;
    }

    private Long categoryParentCategoryIdId(Category category) {
        if ( category == null ) {
            return null;
        }
        Category parentCategoryId = category.getParentCategoryId();
        if ( parentCategoryId == null ) {
            return null;
        }
        Long id = parentCategoryId.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
