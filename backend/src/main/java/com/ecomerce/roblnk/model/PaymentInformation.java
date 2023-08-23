package com.ecomerce.roblnk.model;

import javax.persistence.Column;
import java.time.LocalDate;

public class PaymentInformation {

    @Column(name = "cardholder_name")
    private String cardHolderName;

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;
}
