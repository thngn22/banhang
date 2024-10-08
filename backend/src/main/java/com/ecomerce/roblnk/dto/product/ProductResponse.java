package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.model.Category;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private Integer estimatedPrice;
    private Long saleId;
    private Integer salePrice;
    private Double discountRate;
    private Integer sold;
    private Double rating;
    private String productImage;
    private Long categoryId;
    private String categoryName;
    private Integer quantity;
    private boolean active;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy", timezone = "Asia/Ho_Chi_Minh")
    private Date modifiedDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy", timezone = "Asia/Ho_Chi_Minh")
    private Date createdDate;
}
