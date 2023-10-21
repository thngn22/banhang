package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String password;
    private String email;
    private String phone;
    private boolean isEmailActive;
    private boolean isPhoneActive;
    private String role;
    private String avatar;
    private LocalDateTime createdAt;

    //Address
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @Column(name = "address")
    private List<Address> addresses;

    //Cart
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private Cart cart;

    //Payment Information
    @ElementCollection
    @CollectionTable(name = "user_payment_information", joinColumns = @JoinColumn(name = "user_id"))
    private List<PaymentInformation> paymentInformations = new ArrayList<>();

    //Rating
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private Rating rating;

    //Review
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private Review review;

    //Order
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Order> orders;

}