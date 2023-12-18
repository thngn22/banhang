package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.model.ProductItem;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductConfigurationDTO {
    private Long productItemId;
    private String variationName;
    private String variationOption;
}
