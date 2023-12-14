package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.review.ReviewResponseForProduct;
import com.ecomerce.roblnk.dto.review.ReviewResponseForUser;
import com.ecomerce.roblnk.model.OrderItem;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.model.Review;
import com.ecomerce.roblnk.model.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-13T02:44:54+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class ReviewMapperImpl implements ReviewMapper {

    @Override
    public ReviewResponseForUser toReviewResponseForUser(Review review) {
        if ( review == null ) {
            return null;
        }

        ReviewResponseForUser reviewResponseForUser = new ReviewResponseForUser();

        reviewResponseForUser.setProductId( reviewProductId( review ) );
        reviewResponseForUser.setUserId( reviewUserId( review ) );
        reviewResponseForUser.setUserEmail( reviewUserEmail( review ) );
        reviewResponseForUser.setOrderItemId( reviewOrderItemId( review ) );
        reviewResponseForUser.setProductName( reviewProductName( review ) );
        reviewResponseForUser.setId( review.getId() );
        reviewResponseForUser.setRating( review.getRating() );
        reviewResponseForUser.setImageFeedback( review.getImageFeedback() );
        reviewResponseForUser.setFeedback( review.getFeedback() );
        reviewResponseForUser.setCreatedAt( review.getCreatedAt() );
        reviewResponseForUser.setUpdatedAt( review.getUpdatedAt() );

        return reviewResponseForUser;
    }

    @Override
    public List<ReviewResponseForUser> toReviewResponseForUsers(List<Review> reviews) {
        if ( reviews == null ) {
            return null;
        }

        List<ReviewResponseForUser> list = new ArrayList<ReviewResponseForUser>( reviews.size() );
        for ( Review review : reviews ) {
            list.add( toReviewResponseForUser( review ) );
        }

        return list;
    }

    @Override
    public ReviewResponseForProduct toReviewResponseForProduct(ReviewResponseForUser reviewResponseForUser) {
        if ( reviewResponseForUser == null ) {
            return null;
        }

        ReviewResponseForProduct reviewResponseForProduct = new ReviewResponseForProduct();

        reviewResponseForProduct.setId( reviewResponseForUser.getId() );
        reviewResponseForProduct.setSize( reviewResponseForUser.getSize() );
        reviewResponseForProduct.setColor( reviewResponseForUser.getColor() );
        reviewResponseForProduct.setUserId( reviewResponseForUser.getUserId() );
        reviewResponseForProduct.setUserEmail( reviewResponseForUser.getUserEmail() );
        reviewResponseForProduct.setRating( reviewResponseForUser.getRating() );
        reviewResponseForProduct.setFeedback( reviewResponseForUser.getFeedback() );
        reviewResponseForProduct.setImageFeedback( reviewResponseForUser.getImageFeedback() );
        reviewResponseForProduct.setCreatedAt( reviewResponseForUser.getCreatedAt() );
        reviewResponseForProduct.setUpdatedAt( reviewResponseForUser.getUpdatedAt() );

        return reviewResponseForProduct;
    }

    @Override
    public List<ReviewResponseForProduct> toReviewResponseForProducts(List<ReviewResponseForUser> reviewResponseForUsers) {
        if ( reviewResponseForUsers == null ) {
            return null;
        }

        List<ReviewResponseForProduct> list = new ArrayList<ReviewResponseForProduct>( reviewResponseForUsers.size() );
        for ( ReviewResponseForUser reviewResponseForUser : reviewResponseForUsers ) {
            list.add( toReviewResponseForProduct( reviewResponseForUser ) );
        }

        return list;
    }

    private Long reviewProductId(Review review) {
        if ( review == null ) {
            return null;
        }
        Product product = review.getProduct();
        if ( product == null ) {
            return null;
        }
        Long id = product.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long reviewUserId(Review review) {
        if ( review == null ) {
            return null;
        }
        User user = review.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String reviewUserEmail(Review review) {
        if ( review == null ) {
            return null;
        }
        User user = review.getUser();
        if ( user == null ) {
            return null;
        }
        String email = user.getEmail();
        if ( email == null ) {
            return null;
        }
        return email;
    }

    private Long reviewOrderItemId(Review review) {
        if ( review == null ) {
            return null;
        }
        OrderItem orderItem = review.getOrderItem();
        if ( orderItem == null ) {
            return null;
        }
        Long id = orderItem.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String reviewProductName(Review review) {
        if ( review == null ) {
            return null;
        }
        Product product = review.getProduct();
        if ( product == null ) {
            return null;
        }
        String name = product.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
