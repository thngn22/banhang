package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
    List<ProductItem> findAllByProduct_Id(Long product_id);
}
