/*
package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.model.Review;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.repository.ReviewRepository;
import com.ecomerce.roblnk.dto.review.ReviewRequest;
import com.ecomerce.roblnk.service.ProductService;
import com.ecomerce.roblnk.service.ReviewService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class IReviewService implements ReviewService {

    private ReviewRepository reviewRepository;
    private ProductService productService;
    private ProductRepository productRepository;
    @Override
    public Review createReview(ReviewRequest req, User user) throws ProductException {

        Product product = productService.findProductById(req.getProductId());

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setReview(review.getReview());
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getAllReviewOfProduct(Long productId) {
        return reviewRepository.getAllProductsReview(productId);
    }
}
*/
