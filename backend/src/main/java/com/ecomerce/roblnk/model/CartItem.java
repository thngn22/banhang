package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cart_item")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Long id;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Double price;

    @Column(name = "total_price")
    private Double totalPrice;

    //Cart
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    //Product Item
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "product_item_id")
    private ProductItem productItem;

    //Order Item
    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private OrderItem orderItem;
}
