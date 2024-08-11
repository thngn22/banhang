package com.ecomerce.roblnk.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SaleProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Product
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    //Sale
    @ManyToOne
    @JoinColumn(name = "sale_id")
    private Sale sale;
}
