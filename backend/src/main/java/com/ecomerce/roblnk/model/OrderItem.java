package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer size;
    private String color;
    private Integer quantity;
    private Double price;
    private Double discountedPrice;
    private LocalDateTime createdAt;

    //Cart Item
    @OneToOne(mappedBy = "orderItem")
    @JoinColumn(name = "cart_item_id")
    @JsonIgnore
    private CartItem cartItem;

    //Order Item
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private Order order;
}
