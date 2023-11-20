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

/*    @Query("SELECT p FROM Product p WHERE (p.category.name =:category OR :category='') " +
    "AND ((:minPrice IS NULL AND :maxPrice IS NULL) OR (p.discountedPrice BETWEEN :minPrice AND :maxPrice)) " +
    "AND (:minDiscount IS NULL OR p.discountPersent >=  :minDiscount) " +
    "ORDER BY " +
    "CASE WHEN :sort = 'price_low' THEN p.discountedPrice END ASC, " +
    "CASE WHEN :sort = 'price_high' THEN p.discountedPrice END DESC")*/
    //Optional<List<Product>> findAllByCategory_NameAndDiscountedPriceBetween(@NotNull @Size(max = 150) String category_name, Double minPrice, Double maxPrice);
    Page<Product> findAllByCategoryId(Long category_id, Pageable page);
    Optional<List<Product>> findAllByCategoryId(Long category_id);
    boolean existsProductById(Long id);
}
