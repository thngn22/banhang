package com.ecomerce.roblnk.dto.category;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateCategoryRequest {
    @Valid
    @NotBlank
    private String name;

    @Valid
    @NotBlank
    private Long parentCategoryId;
}
