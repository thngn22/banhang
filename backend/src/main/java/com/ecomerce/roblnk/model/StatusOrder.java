package com.ecomerce.roblnk.model;

import com.ecomerce.roblnk.model.Orders;
import com.ecomerce.roblnk.util.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "status_order")
public class StatusOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Orders
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "statusOrder", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Orders> orders = new ArrayList<>();
    private String orderStatus;

}

