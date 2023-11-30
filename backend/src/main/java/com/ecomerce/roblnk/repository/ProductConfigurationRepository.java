package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.ProductConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductConfigurationRepository extends JpaRepository<ProductConfiguration, Long> {
    Optional<ProductConfiguration> findProductConfigurationByProductItem_IdAndVariationOption_Id(Long productItem_id, Long variationOption_id);
}
