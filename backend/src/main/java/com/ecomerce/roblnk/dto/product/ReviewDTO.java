package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.dto.user.UserProfileResponse;
import com.ecomerce.roblnk.dto.user.UserResponse;
import lombok.Data;

import java.util.Date;

@Data
public class ReviewDTO {
    private Long id;
    private String comment;
    private Double rating;
    private Date createdAt;
    private Date updatedAt;
    private UserReview user;
}
