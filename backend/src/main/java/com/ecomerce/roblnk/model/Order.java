package com.ecomerce.roblnk.model;

import com.ecomerce.roblnk.util.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Status status;
    private Double totalPayment;
    private Integer totalItem;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    //User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    //Address
    @OneToOne
    @JoinColumn(name = "address_id")
    private Address address;

    //Payment Detail
    @ElementCollection
    @CollectionTable(name = "order_payment_detail", joinColumns = @JoinColumn(name = "payment_id"))
    private List<PaymentDetail> paymentDetails = new ArrayList<>();

    //Delivery
    @ElementCollection
    @CollectionTable(name = "order_delivery", joinColumns = @JoinColumn(name = "delivery_id"))
    private List<Delivery> deliveries = new ArrayList<>();

}
