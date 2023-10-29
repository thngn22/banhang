package com.ecomerce.roblnk.dto.product;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RequestProduct {
    @NotBlank
    private Long id;
    @NotBlank
    private String name;
    @NotBlank
    private String brand;
    private String description;
    @NotBlank
    private Double price;
    @NotBlank
    private Double discountedPrice;
    @NotBlank
    private Double discountPercent;
    private String imageUrl;
    private Integer stock;
}
