package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.model.ProductItem;
import com.ecomerce.roblnk.model.Review;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String description;
    private String productImage;
    private Long categoryId;
    private Integer quantity;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date modifiedDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;
    private List<ReviewDTO> reviews;
    private List<ProductItemDTO> productItems;
}
