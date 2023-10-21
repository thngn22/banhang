package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String brand;
    private String description;
    private Double price;
    private Double discountedPrice;
    private Double discountPercent;
    private String imageUrl;
    private Integer stock;

    //Category
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    //Rating
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore
    @Column(name = "rating")
    private List<Rating> ratings;

    //Review
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore
    @Column(name = "review")
    private List<Review> reviews;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore
    @Column(name = "specified_product")
    private  List<SpecifiedProduct> specifiedProducts;


}
