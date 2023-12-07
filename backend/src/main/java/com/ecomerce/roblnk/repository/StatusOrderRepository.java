package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.StatusOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusOrderRepository extends JpaRepository<StatusOrder, Long> {
    Optional<StatusOrder> findStatusOrderByOrderStatusContaining(String orderStatus);
}
