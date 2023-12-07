package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer totalPayment;
    private Integer totalItem;
    private Integer finalPayment;

    @Column(name = "created_at")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    @Column(name = "updated_at")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateAt;

    //User
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id")
    private User user;

    //Address
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "address_id")
    private Address address;

    //Payment Method
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_payment_method_id")
    private UserPaymentMethod userPaymentMethod;

    //Delivery
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    //Order Status
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "order_status")
    private StatusOrder statusOrder;

    //Order Item
    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<OrderItem> orderItems = new ArrayList<>();

}
