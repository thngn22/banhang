package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.util.ByteMultipartFile;
import jakarta.servlet.annotation.MultipartConfig;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data

public class ProductItemRequest {
    private Integer price;
    private Integer warehousePrice;
    private Integer quantityInStock;
    private String size;
    private String color;
}
