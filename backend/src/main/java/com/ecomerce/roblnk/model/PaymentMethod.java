package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "payment_method")
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nameMethod;
    private String describes;

    //Payment Method
    @OneToMany(mappedBy = "paymentMethod", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<UserPaymentMethod> userPaymentMethods = new ArrayList<>();

}
