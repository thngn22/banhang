package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.model.Category;
import lombok.*;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String productImage;
    private Long categoryId;
}
