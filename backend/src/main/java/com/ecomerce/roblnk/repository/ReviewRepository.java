package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByUser_Email(String user_email);
    List<Review> findReviewsByProduct_Id(Long product_id);
    Optional<Review>  findAllByOrderItem_IdAndUser_Email(Long orderItem_id, String user_email);
}
