package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.category.CategoryDTO;
import com.ecomerce.roblnk.dto.product.*;
import com.ecomerce.roblnk.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "active", target = "active")
    ProductResponse toProductResponse(Product product);

    List<ProductResponse> toProductResponseList(List<Product> products);

    @Mapping(source = "active", target = "active")
    @Mapping(source = "category", target = "categoryId")
    ProductDetailResponse toDetailResponse(Product product);

    CategoryDTO toCategoryDTO(Category category);

    ProductDetailResponsev2 toProductDetailResponsev2(ProductDetailResponse productDetailResponse);
    ProductDetailResponsev3 toProductDetailResponsev3(ProductDetailResponse productDetailResponse);


    ReviewDTO toReviewDTO(Review review);

    UserReview toUserReview(User user);

    ProductItemDTO toProductItemDTO(ProductItem productItem);

    @Mapping(source = "productItem.id", target = "productItemId")
    @Mapping(source = "variationOption.value", target = "variationOption")
    @Mapping(source = "variationOption.variation.name", target = "variationName")
    ProductConfigurationDTO toProductConfigurationDTO(ProductConfiguration productConfiguration);


 }
