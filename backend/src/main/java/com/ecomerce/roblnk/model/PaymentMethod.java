package com.ecomerce.roblnk.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "payment_method")
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private PaymentType paymentTypeEnum;
    private String cardNumber;
    private String dateExpire;
    private String CVV;
    private String nameHolder;
    private String addressBanking;
    private String zipCode;

    //User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    //Order
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Orders orders;

}
