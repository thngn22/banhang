package com.ecomerce.roblnk.dto.product;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ProductItemDTOv2 {
    private Long id;
    private Double price;
    private Integer quantityInStock;
    private String productImage;
    private boolean active;
    private List<ProductConfigurationDTO> productConfigurations;

}
