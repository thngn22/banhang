package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.model.ProductItem;
import com.ecomerce.roblnk.model.Review;
import lombok.*;

import java.util.List;

@Data
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String description;
    private String productImage;
    private Long categoryId;
    private Integer quantity;
    private List<ReviewDTO> reviews;
    private List<ProductItemDTO> productItems;
}
