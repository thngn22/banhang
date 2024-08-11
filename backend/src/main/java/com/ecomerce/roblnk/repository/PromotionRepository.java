package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Sale, Long> {

}
