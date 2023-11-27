package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.model.Category;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ProductRequest {
    private ProductCreateRequest productCreateRequest;
    private List<Map<String, List<String>>> variationOptions;
}
