package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.model.Category;
import lombok.Data;

@Data
public class ProductCreateRequest {
    private Long id;
    private String name;
    private String description;
    private String productImage;
    private Long categoryId;

}
