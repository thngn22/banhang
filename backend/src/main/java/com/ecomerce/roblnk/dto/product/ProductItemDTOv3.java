package com.ecomerce.roblnk.dto.product;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductItemDTOv3 {
    private String variationSize;
    private Long id;
    private Double price;
    private Long quantityInStock;
    private String productImage;
    private boolean active;
}
