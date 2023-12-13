package com.ecomerce.roblnk.dto.product;

import lombok.Data;

@Data
public class ProductConfigurationRequest {
    private String variationName;
    private String variationOption;
}
