package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.dto.category.CategoryDTO;
import com.ecomerce.roblnk.dto.review.ReviewResponseForProduct;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class ProductDetailResponsev2 {
    private Long id;
    private String name;
    private Integer estimatedPrice;
    private Integer salePrice;
    private Double discountRate;
    private String description;
    private String productImage;
    private CategoryDTO categoryId;
    private Integer quantityOfVariation;
    private Integer quantity;
    private boolean active;
    private Integer sold;
    private Double rating;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date modifiedDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date createdDate;
    private List<ReviewResponseForProduct> reviews;
    private List<ProductItemResponse> productItemResponses;
}
