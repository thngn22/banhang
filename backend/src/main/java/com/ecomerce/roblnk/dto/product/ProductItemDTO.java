package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.model.ProductConfiguration;
import com.ecomerce.roblnk.model.VariationOption;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class ProductItemDTO {
    private Long id;
    private Double price;
    private Boolean quantityInStock;
    private String productImage;
    private List<ProductConfigurationDTO> productConfigurations;

}
