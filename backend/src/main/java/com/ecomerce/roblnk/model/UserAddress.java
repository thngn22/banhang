package com.ecomerce.roblnk.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "user_address")
public class UserAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_address_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @Column(name = "is_default")
    private boolean isDefault;
}
