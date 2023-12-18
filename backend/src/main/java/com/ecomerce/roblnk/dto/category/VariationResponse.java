package com.ecomerce.roblnk.dto.category;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VariationResponse {
    private Long id;
    private String name;
    private Long categoryId;
}
