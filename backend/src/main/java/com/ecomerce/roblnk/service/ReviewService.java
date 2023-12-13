package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Review;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.dto.review.ReviewRequest;
import java.util.List;
import java.util.Optional;

public interface ReviewService{
    String getURLPictureAndUploadToCloudinaryReview(String base64Content);
    List<Review> findAllByUser_Email(String user_email);
    Review findReviewByUser_EmailAndOrderItemId(String user_email, Long orderItemId);
    List<Review> findAllByProductId(Long id);

}
