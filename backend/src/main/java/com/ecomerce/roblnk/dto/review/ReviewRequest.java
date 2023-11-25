package com.ecomerce.roblnk.dto.review;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {
    private Long productId;
    private String review;
}
