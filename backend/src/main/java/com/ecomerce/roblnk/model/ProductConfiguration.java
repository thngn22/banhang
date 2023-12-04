package com.ecomerce.roblnk.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_configuration_id")
    private Long id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "product_item_id")
    private ProductItem productItem;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "variation_option_id")
    private VariationOption variationOption;
}
