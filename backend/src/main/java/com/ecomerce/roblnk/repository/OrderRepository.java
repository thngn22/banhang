package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {
    List<Orders> findAllByUser_Email(String user_email);
    Optional<Orders> findOrdersByUser_EmailAndId(String user_email, Long id);
}
