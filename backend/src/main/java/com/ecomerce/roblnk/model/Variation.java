package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
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
    @OneToMany(mappedBy = "variation")
    @JsonIgnore
    private List<VariationOption> variationOptions;
}
