package com.ecomerce.roblnk.dto.product;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
public class ProductItemCartDTO {
    private Long id;
    private String productImage;
    private String name;
    private String size;
    private String color;
    private Long productId;
    private boolean active;
}
