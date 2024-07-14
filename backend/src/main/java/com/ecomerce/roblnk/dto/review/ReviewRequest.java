package com.ecomerce.roblnk.dto.review;

import com.ecomerce.roblnk.util.ByteMultipartFile;
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
    private ByteMultipartFile imageFeedback;
}
