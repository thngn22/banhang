package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Column(name = "name")
    private String name;


    //Product
    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Product> products;

    @ManyToOne
    @JoinColumn(name = "parent_category_id")
    private Category parentCategoryId;


    //Category
    @OneToMany(mappedBy = "parentCategoryId")
    @JsonIgnore
    private List<Category> categories;

    //Promotion
    @ManyToMany
    @JsonIgnore
    @JoinTable(
            name = "category_promotion",
            joinColumns = @JoinColumn(name = "category_id"),
            inverseJoinColumns = @JoinColumn(name = "promotion_id")
    )
    private List<Promotion> promotions;
}
