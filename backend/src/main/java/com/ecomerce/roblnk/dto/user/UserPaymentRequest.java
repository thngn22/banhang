package com.ecomerce.roblnk.dto.user;

import lombok.Data;

@Data
public class UserPaymentRequest {
    private String cardNumber;
    private String dateExpire;
    private String CVV;
    private String nameHolder;
    private String addressBanking;
    private String zipCode;
}
