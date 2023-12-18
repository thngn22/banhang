package com.ecomerce.roblnk.dto.order;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class DeliveryDTO {
    private Long id;
    private String name;
    private Integer price;
    private String description;
    private Integer estimatedShippingTime;
}
