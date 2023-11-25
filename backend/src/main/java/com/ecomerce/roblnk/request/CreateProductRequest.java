package com.ecomerce.roblnk.request;

import com.ecomerce.roblnk.model.Size;
import lombok.*;

import jakarta.persistence.Entity;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    private String title;
    private String description;
    private int price;
    private int discountedPrice;
    private int discountedPersent;
    private int quantity;
    private String branch;
    private String color;
    private Set<Size> sizes = new HashSet<>();
    private String imageUrl;
    private String topLevelCategory;
    private String secondLevelCategory;
    private String thirdLevelCategory;

}

