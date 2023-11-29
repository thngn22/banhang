package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_item_id")
    private Long id;

    @Column(name = "price")
    private Double price;

    @Column(name = "quantity_in_stock")
    private Long quantityInStock;

    @Column(name = "product_image")
    private String productImage;

    @Column(name = "is_active")
    private boolean active;

    //Product
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    //Cart Item
    @OneToMany(mappedBy = "productItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CartItem> cartItems = new ArrayList<>();

    //Product Configuration
    @OneToMany(mappedBy = "productItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnore
    private List<ProductConfiguration> productConfigurations = new ArrayList<>();
}
