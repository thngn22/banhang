package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.ArrayList;
import java.util.Date;
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

    @Column(name = "product_name")
    private String name;

    @Column(name = "price")
    private Integer price;

    @Column(name = "quantity_in_stock")
    private Integer quantityInStock;

    @Column(name = "product_image", length = 100000)
    private String productImage;

    @Column(name = "is_active")
    private boolean active;

    @Column(name = "created_date")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;

    @Column(name = "modified_date")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date modifiedDate;

    //Order Item
    @OneToMany(mappedBy = "productItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderItem> orderItems;

    //Product
    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    //Cart Item
    @OneToMany(mappedBy = "productItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CartItem> cartItems = new ArrayList<>();

    //Product Configuration
    @OneToMany(mappedBy = "productItem", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<ProductConfiguration> productConfigurations = new ArrayList<>();
}
