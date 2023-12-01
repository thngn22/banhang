package com.ecomerce.roblnk.dto.product;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductItemResponseGeneral {
    List<ProductItemResponse> productItemResponses;
}
