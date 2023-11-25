package com.ecomerce.roblnk.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Entity
@Data
@Table(name = "variation_option")
public class VariationOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variation_option_id")
    private Long id;

    @Column(name = "value")
    private String value;

    //Variation
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "variation_id")
    private Variation variation;

    //Product Item
    @OneToMany(mappedBy = "variationOption", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProductConfiguration> productConfigurations;
}
