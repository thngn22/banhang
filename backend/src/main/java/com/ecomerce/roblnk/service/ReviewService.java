package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Review;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.dto.review.ReviewRequest;
import java.util.List;

public interface ReviewService{
    Review createReview(ReviewRequest req, User user) throws ProductException;
    List<Review> getAllReviewOfProduct(Long productId);
}
