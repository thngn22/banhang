package com.ecomerce.roblnk.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMethodResponse {
    private Long id;
    private String nameMethod;
    private String describes;

}
