package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.SpecifiedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecifiedProductRepository extends JpaRepository<SpecifiedProduct, Long> {
}
