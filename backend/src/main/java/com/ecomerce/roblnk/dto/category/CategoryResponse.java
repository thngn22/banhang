package com.ecomerce.roblnk.dto.category;

import com.ecomerce.roblnk.model.Category;
import lombok.Data;

import java.util.List;

@Data
public class CategoryResponse {
    private Long id;
    private String name;
    private Long parentCategoryId;
    private List<CategoryResponse> categories;

}
