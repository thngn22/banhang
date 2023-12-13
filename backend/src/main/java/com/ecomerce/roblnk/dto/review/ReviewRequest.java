package com.ecomerce.roblnk.dto.review;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
    private Long orderItemId;
    private Long productId;
    private Integer ratingStars;
    private String feedback;
    private String imageFeedback;
}
