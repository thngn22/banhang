package com.ecomerce.roblnk.model;

import com.ecomerce.roblnk.util.Status;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Status status;
    private Double totalPayment;
    private Integer totalItem;

    @Column(name = "created_at")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    @Column(name = "updated_at")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateAt;

    //User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    //Address
    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    //Payment Method
    @OneToMany(mappedBy = "orders")
    @JsonIgnore
    private List<PaymentMethod> paymentMethods;

    //Delivery
    @ManyToOne
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

}
