package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.model.ProductItem;
import lombok.Data;

@Data
public class ProductConfigurationDTO {
    private Long productItemId;
    private String variationName;
    private String variationOption;
}
