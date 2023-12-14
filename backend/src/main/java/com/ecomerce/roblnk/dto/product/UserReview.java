package com.ecomerce.roblnk.dto.product;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserReview {
    private Long id;
    private String lastName;
    private String avatar;
}
