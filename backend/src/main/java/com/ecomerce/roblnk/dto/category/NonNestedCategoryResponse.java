package com.ecomerce.roblnk.dto.category;

import lombok.Data;

@Data
public class NonNestedCategoryResponse {
    private Long id;
    private String name;
    private Long parentCategoryId;
}
