package com.ecomerce.roblnk.dto.user;

import com.ecomerce.roblnk.model.PaymentType;
import lombok.Data;

@Data
public class UserPaymentResponse {
    private Long id;
    private PaymentType paymentTypeEnum;
    private String cardNumber;
    private String nameHolder;
    private String addressBanking;
    private String zipCode;
}
