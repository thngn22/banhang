package com.ecomerce.roblnk.dto.cart;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutRequest {
    private List<Long> cartItemId;
    private Long addressId;
    private Long paymentMethodId;
    private Long deliveryId;
    private String phoneNumber;
}
