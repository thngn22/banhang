/*
package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.model.Rating;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.repository.RatingRepository;
import com.ecomerce.roblnk.dto.rating.RatingRequest;
import com.ecomerce.roblnk.service.ProductService;
import com.ecomerce.roblnk.service.RatingService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class IRatingService implements RatingService {

    private RatingRepository ratingRepository;
    private ProductService productService;

    @Override
    public Rating createRating(RatingRequest ratingRequest, User user) throws ProductException {
        Product product = productService.findProductById(ratingRequest.getProductId());

        Rating rating = new Rating();
        rating.setProduct(product);
        rating.setUser(user);
        rating.setRating(ratingRequest.getRating());
        rating.setCreatedAt(LocalDateTime.now());

        return ratingRepository.save(rating);
    }

    @Override
    public List<Rating> getProductRating(Long productId) {
        return ratingRepository.getAllProductsRating(productId);
    }
}
*/
