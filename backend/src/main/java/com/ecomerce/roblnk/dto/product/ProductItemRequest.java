package com.ecomerce.roblnk.dto.product;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ProductItemRequest {
    private Double price;
    private Long quantityInStock;
    private String productImage;
    private List<ProductConfigurationRequest> productConfigurations;
}
