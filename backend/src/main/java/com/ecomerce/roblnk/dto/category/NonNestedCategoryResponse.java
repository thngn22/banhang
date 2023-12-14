package com.ecomerce.roblnk.dto.category;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NonNestedCategoryResponse {
    private Long id;
    private String name;
    private Long parentCategoryId;
}
