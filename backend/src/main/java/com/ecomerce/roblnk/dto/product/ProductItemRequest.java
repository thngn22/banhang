package com.ecomerce.roblnk.dto.product;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ProductItemRequest {
    private Integer price;
    private Integer quantityInStock;
    private String productImage;
    private String size;
    private String color;
}
