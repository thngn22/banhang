package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.dto.product.ProductItemResponse;
import com.ecomerce.roblnk.dto.product.ReviewDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailResponsev3 {
    private Long id;
    private String name;
    private String description;
    private String productImage;
    private Long categoryId;
    private Integer quantityOfVariation;
    private Integer quantity;
    private boolean active;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date modifiedDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;
    List<ProductItemResponse> productItemResponses;
    
}
