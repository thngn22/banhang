package com.ecomerce.roblnk.dto.rating;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingRequest {
    private Long productId;
    private double rating;
}
