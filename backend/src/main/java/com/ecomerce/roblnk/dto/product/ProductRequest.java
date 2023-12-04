package com.ecomerce.roblnk.dto.product;

import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private String productImage;
    private Long categoryId;
    private List<ProductItemRequest> productItems;
}
