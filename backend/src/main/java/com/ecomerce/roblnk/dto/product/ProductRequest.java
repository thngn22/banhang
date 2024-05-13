package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.util.ByteMultipartFile;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Long categoryId;
    private List<ProductItemRequest> productItems;
}
