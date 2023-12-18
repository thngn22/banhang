package com.ecomerce.roblnk.dto.user;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserPaymentResponse {
    private Long id;
    private String cardNumber;
}
