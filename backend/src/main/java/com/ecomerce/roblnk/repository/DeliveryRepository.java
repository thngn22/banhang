package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

}
