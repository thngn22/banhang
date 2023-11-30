package com.ecomerce.roblnk.dto.user;

import com.ecomerce.roblnk.dto.product.ProductDTO;
import com.ecomerce.roblnk.model.Product;
import lombok.Data;

import java.util.Date;

@Data
public class UserReviewDTO {
    private Long id;
    private String comment;
    private Double rating;
    private Date createdAt;
    private Date updatedAt;
    private ProductDTO product;

}
