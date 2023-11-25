package com.ecomerce.roblnk.dto.user;

import com.ecomerce.roblnk.model.PaymentType;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class UserPaymentRequest {
    private PaymentType paymentTypeEnum;
    private String cardNumber;
    private String dateExpire;
    private String CVV;
    private String nameHolder;
    private String addressBanking;
    private String zipCode;
}
