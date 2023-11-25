package com.ecomerce.roblnk.dto.product;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
public class CreateProductRequest {

    private String name;
    private String brand;
    private String description;
    private Double price;
    private Double discountedPrice;
    private Double discountPercent;
    private String imageUrl;
    private Integer stock;

}

