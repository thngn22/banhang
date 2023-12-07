package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Integer price;

    @Column(name = "total_price")
    private Integer totalPrice;

    @Column(name = "created_at")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    //Cart Item
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_item_id")
    private CartItem cartItem;

    //Order Item
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private Orders orders;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "product_item_id")
    private ProductItem productItem;
}
