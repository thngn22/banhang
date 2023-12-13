package com.ecomerce.roblnk.dto.product;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductItemCartDTO {
    private Long id;
    private String productImage;
    private String name;
}
