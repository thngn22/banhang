package com.ecomerce.roblnk.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Embeddable
@Getter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Delivery {
    private String name;
    private Double price;
    private String description;
    private LocalDateTime time;
}
