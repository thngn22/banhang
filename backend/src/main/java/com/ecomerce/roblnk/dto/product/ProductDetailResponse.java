package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.dto.category.CategoryDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;
@Setter
@Getter
@NoArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String estimatedPrice;
    private String description;
    private String productImage;
    private CategoryDTO categoryId;
    private Integer quantityOfVariation;
    private Integer quantity;
    private boolean active;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date modifiedDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;
    private List<ProductItemDTO> productItems;
    private Integer sold;
    private Double rating;
    private List<ReviewDTO> reviews;
}
