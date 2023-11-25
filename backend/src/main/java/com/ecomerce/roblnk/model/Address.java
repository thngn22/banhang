package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

@Entity
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "street_address")
    private String streetAddress;

    @Column(name = "city")
    private String city;

    @Column(name = "zip_code")
    private String zipCode;

    //User Address
    @OneToMany(mappedBy = "address", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<UserAddress> userAddresses;

    //Order
    @OneToMany(mappedBy = "address", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Orders> orders;
}
