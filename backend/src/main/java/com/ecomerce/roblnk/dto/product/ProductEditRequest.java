package com.ecomerce.roblnk.dto.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductEditRequest {
    private ProductDTO productDTO;
    private List<ProductItemDTOv2> productItems;
}
