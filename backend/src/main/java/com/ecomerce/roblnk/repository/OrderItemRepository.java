package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
