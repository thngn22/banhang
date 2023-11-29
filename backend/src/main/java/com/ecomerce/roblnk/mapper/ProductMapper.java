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
    @Mapping(source = "category.id", target = "categoryId")
    ProductDetailResponse toDetailResponse(Product product);

    ReviewDTO toReviewDTO(Review review);

    UserReview toUserReview(User user);

    ProductItemDTO toProductItemDTO(ProductItem productItem);

    @Mapping(source = "productItem.id", target = "productItemId")
    @Mapping(source = "variationOption.value", target = "variationOption")
    @Mapping(source = "variationOption.variation.name", target = "variationName")
    ProductConfigurationDTO toProductConfigurationDTO(ProductConfiguration productConfiguration);

    Product toEntityProduct(ProductCreateRequest productCreateRequest);
    ProductItem toProductItem(ProductItemRequest productItemRequest);
    List<ProductItem> toProductItems(List<ProductItemRequest> productItemRequests);

    @Mapping(source = "variationName", target = "variationOption.variation.name")
    ProductConfiguration toProductConfiguration (ProductConfigurationRequest productConfigurationRequest);


 }
