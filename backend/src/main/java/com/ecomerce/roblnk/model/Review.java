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
@Table(name = "review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long id;
    private String comment;
    private Double rating;

    @Column(name = "created_at")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    @Column(name = "updated_at")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updatedAt;

    //Product
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    //User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
