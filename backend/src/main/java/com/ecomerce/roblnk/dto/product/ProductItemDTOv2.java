package com.ecomerce.roblnk.dto.product;

import lombok.*;

import java.util.List;

@Setter
@Getter
public class ProductItemDTOv2 {
    private Long id;
    private Integer price;
    private Integer quantityInStock;
    private String productImage;
    private boolean active;
    private String size;
    private String color;
}
