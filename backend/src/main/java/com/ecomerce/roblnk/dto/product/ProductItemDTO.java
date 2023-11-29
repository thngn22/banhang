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
    private Long quantityInStock;
    private String productImage;
    private boolean active;
    private List<ProductConfigurationDTO> productConfigurations;

}
