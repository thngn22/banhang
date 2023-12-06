package com.ecomerce.roblnk.dto.order;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class DeliveryDTO {
    private Long id;
    private String name;
    private Integer price;
    private String description;
    private Integer estimatedShippingTime;

}
