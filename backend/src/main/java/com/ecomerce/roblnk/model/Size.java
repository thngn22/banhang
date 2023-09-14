package com.ecomerce.roblnk.model;

import lombok.*;

import jakarta.persistence.Embeddable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Embeddable
public class Size {

    private String name;
    private int quantity;
}
