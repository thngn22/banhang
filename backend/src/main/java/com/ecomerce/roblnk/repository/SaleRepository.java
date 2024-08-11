package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long>, JpaSpecificationExecutor<Sale> {
    List<Sale> findAllByActiveIsTrue();
}
