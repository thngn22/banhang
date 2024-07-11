package com.ecomerce.roblnk.dto.category;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateCategoryRequest {
    @NotBlank
    private String name;

    private Long parentCategoryId;
}
