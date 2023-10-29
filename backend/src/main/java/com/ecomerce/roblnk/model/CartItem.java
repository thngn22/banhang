package com.ecomerce.roblnk.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer size;
    private String color;
    private Integer quantity;
    private Double price;
    private Double discountedPrice;


    //Cart
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    //Specified Product
    @OneToOne
    @JoinColumn(name = "specified_product_id")
    private SpecifiedProduct specifiedProduct;

    //Order Item
    @OneToOne(fetch = FetchType.LAZY, orphanRemoval = true)
    private OrderItem orderItem;
}
