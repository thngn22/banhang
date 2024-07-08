package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.SaleProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaleProductRepository extends JpaRepository<SaleProduct, Long> {
    Optional<SaleProduct> findSaleProductByProduct_IdAndSaleNotNullAndSale_Active(Long product_id, boolean sale_active);
    List<SaleProduct> findAllByProduct_Id(Long product_id);
    Optional<SaleProduct> findSaleProductByProduct_IdAndSale_Id(Long product_id, Long sale_id);
    List<SaleProduct> findAllBySale_Id(Long sale_id);
}
