package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "city", length = 1000)
    private String city;

    @Column(name = "district", length = 1000)
    private String district;

    @Column(name = "ward", length = 1000)
    private String ward;

    @Column(name = "address")
    private String address;

    @Column(name = "is_default")
    private boolean _default;

    @Column(name = "is_active")
    private boolean active;

    //User
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    //Order
    @OneToMany(mappedBy = "address", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Orders> orders;
}
