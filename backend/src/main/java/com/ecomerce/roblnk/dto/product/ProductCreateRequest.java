package com.ecomerce.roblnk.dto.product;

import lombok.Data;

@Data
public class ProductCreateRequest {
    private String name;
    private String description;
    private String productImage;
    private Long categoryId;

}
