package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Variation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variation_id")
    private Long id;

    @Column(name = "name")
    private String name;


    //Category
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    //Variation Option
    @OneToMany(mappedBy = "variation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<VariationOption> variationOptions = new ArrayList<>();
}
