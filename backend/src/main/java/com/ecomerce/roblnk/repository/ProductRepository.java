package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Product;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{
    Page<Product> findAllByCategoryId(Long category_id, Pageable page);
    List<Product> findAllByCategoryId(Long category_id);
}
