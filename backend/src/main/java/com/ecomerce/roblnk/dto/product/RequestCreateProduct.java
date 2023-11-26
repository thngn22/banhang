package com.ecomerce.roblnk.dto.product;

import lombok.Data;

import java.util.List;

@Data
public class RequestCreateProduct {
    private Long id;
    private String name;
    private String description;
    private String productImage;
    private Long category;
    private List<Integer> productItems;

}
