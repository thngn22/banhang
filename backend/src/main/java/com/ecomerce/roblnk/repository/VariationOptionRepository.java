package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.VariationOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VariationOptionRepository extends JpaRepository<VariationOption, Long> {
    List<VariationOption> findAllByVariation_Id(Long variation_id);
    VariationOption findVariationOptionByVariation_IdAndValueContainingIgnoreCase(Long variation_id, String value);
}
