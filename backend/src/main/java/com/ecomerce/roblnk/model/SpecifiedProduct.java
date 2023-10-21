package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SpecifiedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String color;
    private Integer size;
    private String branch;
    private Double price;
    private Double discountPercent;
    private Double discountedPrice;
    private Boolean isSelling;
    private String imgUrl;
    private Integer quantity;

    //Product
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    //Cart Item
    @OneToOne(mappedBy = "specifiedProduct")
    @JsonIgnore
    private CartItem cartItem;
}
