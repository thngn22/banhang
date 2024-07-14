package com.ecomerce.roblnk.dto.delivery;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryResponse {
    private Long deliveryId;
    private String deliveryName;
    private String deliveryDescription;
}
