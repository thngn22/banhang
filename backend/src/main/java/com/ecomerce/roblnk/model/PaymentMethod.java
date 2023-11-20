package com.ecomerce.roblnk.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "payment_method")
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private PaymentType paymentTypeEnum;

    //User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    //Order
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Orders orders;

}
