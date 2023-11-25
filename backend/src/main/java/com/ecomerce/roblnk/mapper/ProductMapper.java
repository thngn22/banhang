package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.product.*;
import com.ecomerce.roblnk.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.id", target = "categoryId")
    ProductResponse toProductResponse(Product product);

    List<ProductResponse> toProductResponseList(List<Product> products);

    ProductDetailResponse toDetailResponse(Product product);

    ReviewDTO toReviewDTO(Review review);

    UserReview toUserReview(User user);

    ProductItemDTO toProductItemDTO(ProductItem productItem);

    @Mapping(source = "productItem.id", target = "productItemId")
    @Mapping(source = "variationOption.id", target = "variationOptionId")
    ProductConfigurationDTO toProductConfigurationDTO(ProductConfiguration productConfiguration);
}
