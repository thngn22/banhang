package com.ecomerce.roblnk.dto.product;

import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {
    private ProductCreateRequest productCreateRequest;
    private List<ProductItemRequest> productItems;
}
