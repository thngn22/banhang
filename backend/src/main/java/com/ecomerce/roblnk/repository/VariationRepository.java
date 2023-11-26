package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Variation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VariationRepository extends JpaRepository<Variation, Long> {
    List<Variation> findVariationsByCategory_Id(Long category_id);
}
