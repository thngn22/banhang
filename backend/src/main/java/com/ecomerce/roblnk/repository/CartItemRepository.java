package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Cart;
import com.ecomerce.roblnk.model.CartItem;
import com.ecomerce.roblnk.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findAllByProductItem_IdAndCart_Id(Long productItem_id, Long cart_id);
    List<CartItem> findAllByCart_Id(Long cart_id);
    Optional<CartItem> findCartItemByCart_IdAndId(Long cart_id, Long id);
}
