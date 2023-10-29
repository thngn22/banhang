package com.ecomerce.roblnk.dto.product;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String brand;
    private String description;
    private Double price;
    private Double discountedPrice;
    private Double discountPercent;
    private String imageUrl;
    private Integer stock;
}
