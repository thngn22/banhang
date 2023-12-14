package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.category.CategoryDTO;
import com.ecomerce.roblnk.dto.product.ProductConfigurationDTO;
import com.ecomerce.roblnk.dto.product.ProductConfigurationRequest;
import com.ecomerce.roblnk.dto.product.ProductDetailResponse;
import com.ecomerce.roblnk.dto.product.ProductDetailResponsev2;
import com.ecomerce.roblnk.dto.product.ProductDetailResponsev3;
import com.ecomerce.roblnk.dto.product.ProductItemDTO;
import com.ecomerce.roblnk.dto.product.ProductItemDTOv2;
import com.ecomerce.roblnk.dto.product.ProductResponse;
import com.ecomerce.roblnk.dto.product.ReviewDTO;
import com.ecomerce.roblnk.dto.product.UserReview;
import com.ecomerce.roblnk.dto.review.ReviewResponseForProduct;
import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.model.ProductConfiguration;
import com.ecomerce.roblnk.model.ProductItem;
import com.ecomerce.roblnk.model.Review;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.model.Variation;
import com.ecomerce.roblnk.model.VariationOption;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-13T02:44:56+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductResponse toProductResponse(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductResponse productResponse = new ProductResponse();

        productResponse.setCategoryName( productCategoryName( product ) );
        productResponse.setCategoryId( productCategoryId( product ) );
        productResponse.setActive( product.isActive() );
        productResponse.setId( product.getId() );
        productResponse.setName( product.getName() );
        productResponse.setEstimatedPrice( product.getEstimatedPrice() );
        productResponse.setSold( product.getSold() );
        productResponse.setRating( product.getRating() );
        productResponse.setProductImage( product.getProductImage() );
        productResponse.setModifiedDate( product.getModifiedDate() );
        productResponse.setCreatedDate( product.getCreatedDate() );

        return productResponse;
    }

    @Override
    public List<ProductResponse> toProductResponseList(List<Product> products) {
        if ( products == null ) {
            return null;
        }

        List<ProductResponse> list = new ArrayList<ProductResponse>( products.size() );
        for ( Product product : products ) {
            list.add( toProductResponse( product ) );
        }

        return list;
    }

    @Override
    public ProductDetailResponse toDetailResponse(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductDetailResponse productDetailResponse = new ProductDetailResponse();

        productDetailResponse.setActive( product.isActive() );
        productDetailResponse.setCategoryId( toCategoryDTO( product.getCategory() ) );
        productDetailResponse.setId( product.getId() );
        productDetailResponse.setName( product.getName() );
        productDetailResponse.setEstimatedPrice( product.getEstimatedPrice() );
        productDetailResponse.setDescription( product.getDescription() );
        productDetailResponse.setProductImage( product.getProductImage() );
        productDetailResponse.setModifiedDate( product.getModifiedDate() );
        productDetailResponse.setCreatedDate( product.getCreatedDate() );
        productDetailResponse.setProductItems( productItemListToProductItemDTOList( product.getProductItems() ) );
        productDetailResponse.setSold( product.getSold() );
        productDetailResponse.setRating( product.getRating() );
        productDetailResponse.setReviews( reviewListToReviewDTOList( product.getReviews() ) );

        return productDetailResponse;
    }

    @Override
    public CategoryDTO toCategoryDTO(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryDTO categoryDTO = new CategoryDTO();

        categoryDTO.setId( category.getId() );
        categoryDTO.setName( category.getName() );

        return categoryDTO;
    }

    @Override
    public ProductDetailResponsev2 toProductDetailResponsev2(ProductDetailResponse productDetailResponse) {
        if ( productDetailResponse == null ) {
            return null;
        }

        ProductDetailResponsev2 productDetailResponsev2 = new ProductDetailResponsev2();

        productDetailResponsev2.setId( productDetailResponse.getId() );
        productDetailResponsev2.setName( productDetailResponse.getName() );
        productDetailResponsev2.setEstimatedPrice( productDetailResponse.getEstimatedPrice() );
        productDetailResponsev2.setDescription( productDetailResponse.getDescription() );
        productDetailResponsev2.setProductImage( productDetailResponse.getProductImage() );
        productDetailResponsev2.setCategoryId( productDetailResponse.getCategoryId() );
        productDetailResponsev2.setQuantityOfVariation( productDetailResponse.getQuantityOfVariation() );
        productDetailResponsev2.setQuantity( productDetailResponse.getQuantity() );
        productDetailResponsev2.setActive( productDetailResponse.isActive() );
        productDetailResponsev2.setSold( productDetailResponse.getSold() );
        productDetailResponsev2.setRating( productDetailResponse.getRating() );
        productDetailResponsev2.setModifiedDate( productDetailResponse.getModifiedDate() );
        productDetailResponsev2.setCreatedDate( productDetailResponse.getCreatedDate() );
        productDetailResponsev2.setReviews( reviewDTOListToReviewResponseForProductList( productDetailResponse.getReviews() ) );

        return productDetailResponsev2;
    }

    @Override
    public ProductDetailResponsev3 toProductDetailResponsev3(ProductDetailResponse productDetailResponse) {
        if ( productDetailResponse == null ) {
            return null;
        }

        ProductDetailResponsev3 productDetailResponsev3 = new ProductDetailResponsev3();

        productDetailResponsev3.setId( productDetailResponse.getId() );
        productDetailResponsev3.setName( productDetailResponse.getName() );
        productDetailResponsev3.setEstimatedPrice( productDetailResponse.getEstimatedPrice() );
        productDetailResponsev3.setDescription( productDetailResponse.getDescription() );
        productDetailResponsev3.setProductImage( productDetailResponse.getProductImage() );
        productDetailResponsev3.setCategoryId( productDetailResponse.getCategoryId() );
        productDetailResponsev3.setQuantityOfVariation( productDetailResponse.getQuantityOfVariation() );
        productDetailResponsev3.setQuantity( productDetailResponse.getQuantity() );
        productDetailResponsev3.setActive( productDetailResponse.isActive() );
        productDetailResponsev3.setModifiedDate( productDetailResponse.getModifiedDate() );
        productDetailResponsev3.setCreatedDate( productDetailResponse.getCreatedDate() );
        productDetailResponsev3.setProductItems( productItemDTOListToProductItemDTOv2List( productDetailResponse.getProductItems() ) );

        return productDetailResponsev3;
    }

    @Override
    public ReviewDTO toReviewDTO(Review review) {
        if ( review == null ) {
            return null;
        }

        ReviewDTO reviewDTO = new ReviewDTO();

        reviewDTO.setId( review.getId() );
        if ( review.getRating() != null ) {
            reviewDTO.setRating( review.getRating().doubleValue() );
        }
        reviewDTO.setCreatedAt( review.getCreatedAt() );
        reviewDTO.setUpdatedAt( review.getUpdatedAt() );
        reviewDTO.setUser( toUserReview( review.getUser() ) );

        return reviewDTO;
    }

    @Override
    public UserReview toUserReview(User user) {
        if ( user == null ) {
            return null;
        }

        UserReview userReview = new UserReview();

        userReview.setId( user.getId() );
        userReview.setLastName( user.getLastName() );
        userReview.setAvatar( user.getAvatar() );

        return userReview;
    }

    @Override
    public ProductItemDTO toProductItemDTO(ProductItem productItem) {
        if ( productItem == null ) {
            return null;
        }

        ProductItemDTO productItemDTO = new ProductItemDTO();

        productItemDTO.setId( productItem.getId() );
        productItemDTO.setPrice( productItem.getPrice() );
        productItemDTO.setQuantityInStock( productItem.getQuantityInStock() );
        productItemDTO.setProductImage( productItem.getProductImage() );
        productItemDTO.setActive( productItem.isActive() );
        productItemDTO.setModifiedDate( productItem.getModifiedDate() );
        productItemDTO.setCreatedDate( productItem.getCreatedDate() );
        productItemDTO.setProductConfigurations( productConfigurationListToProductConfigurationDTOList( productItem.getProductConfigurations() ) );

        return productItemDTO;
    }

    @Override
    public ProductConfigurationDTO toProductConfigurationDTO(ProductConfiguration productConfiguration) {
        if ( productConfiguration == null ) {
            return null;
        }

        ProductConfigurationDTO productConfigurationDTO = new ProductConfigurationDTO();

        productConfigurationDTO.setProductItemId( productConfigurationProductItemId( productConfiguration ) );
        productConfigurationDTO.setVariationOption( productConfigurationVariationOptionValue( productConfiguration ) );
        productConfigurationDTO.setVariationName( productConfigurationVariationOptionVariationName( productConfiguration ) );

        return productConfigurationDTO;
    }

    @Override
    public ProductConfiguration toProductConfiguration(ProductConfigurationRequest productConfigurationRequest) {
        if ( productConfigurationRequest == null ) {
            return null;
        }

        ProductConfiguration productConfiguration = new ProductConfiguration();

        productConfiguration.setVariationOption( productConfigurationRequestToVariationOption( productConfigurationRequest ) );

        return productConfiguration;
    }

    private String productCategoryName(Product product) {
        if ( product == null ) {
            return null;
        }
        Category category = product.getCategory();
        if ( category == null ) {
            return null;
        }
        String name = category.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long productCategoryId(Product product) {
        if ( product == null ) {
            return null;
        }
        Category category = product.getCategory();
        if ( category == null ) {
            return null;
        }
        Long id = category.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected List<ProductItemDTO> productItemListToProductItemDTOList(List<ProductItem> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductItemDTO> list1 = new ArrayList<ProductItemDTO>( list.size() );
        for ( ProductItem productItem : list ) {
            list1.add( toProductItemDTO( productItem ) );
        }

        return list1;
    }

    protected List<ReviewDTO> reviewListToReviewDTOList(List<Review> list) {
        if ( list == null ) {
            return null;
        }

        List<ReviewDTO> list1 = new ArrayList<ReviewDTO>( list.size() );
        for ( Review review : list ) {
            list1.add( toReviewDTO( review ) );
        }

        return list1;
    }

    protected ReviewResponseForProduct reviewDTOToReviewResponseForProduct(ReviewDTO reviewDTO) {
        if ( reviewDTO == null ) {
            return null;
        }

        ReviewResponseForProduct reviewResponseForProduct = new ReviewResponseForProduct();

        reviewResponseForProduct.setId( reviewDTO.getId() );
        if ( reviewDTO.getRating() != null ) {
            reviewResponseForProduct.setRating( reviewDTO.getRating().intValue() );
        }
        reviewResponseForProduct.setCreatedAt( reviewDTO.getCreatedAt() );
        reviewResponseForProduct.setUpdatedAt( reviewDTO.getUpdatedAt() );

        return reviewResponseForProduct;
    }

    protected List<ReviewResponseForProduct> reviewDTOListToReviewResponseForProductList(List<ReviewDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<ReviewResponseForProduct> list1 = new ArrayList<ReviewResponseForProduct>( list.size() );
        for ( ReviewDTO reviewDTO : list ) {
            list1.add( reviewDTOToReviewResponseForProduct( reviewDTO ) );
        }

        return list1;
    }

    protected ProductItemDTOv2 productItemDTOToProductItemDTOv2(ProductItemDTO productItemDTO) {
        if ( productItemDTO == null ) {
            return null;
        }

        ProductItemDTOv2 productItemDTOv2 = new ProductItemDTOv2();

        productItemDTOv2.setId( productItemDTO.getId() );
        productItemDTOv2.setPrice( productItemDTO.getPrice() );
        productItemDTOv2.setQuantityInStock( productItemDTO.getQuantityInStock() );
        productItemDTOv2.setProductImage( productItemDTO.getProductImage() );
        productItemDTOv2.setActive( productItemDTO.isActive() );

        return productItemDTOv2;
    }

    protected List<ProductItemDTOv2> productItemDTOListToProductItemDTOv2List(List<ProductItemDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductItemDTOv2> list1 = new ArrayList<ProductItemDTOv2>( list.size() );
        for ( ProductItemDTO productItemDTO : list ) {
            list1.add( productItemDTOToProductItemDTOv2( productItemDTO ) );
        }

        return list1;
    }

    protected List<ProductConfigurationDTO> productConfigurationListToProductConfigurationDTOList(List<ProductConfiguration> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductConfigurationDTO> list1 = new ArrayList<ProductConfigurationDTO>( list.size() );
        for ( ProductConfiguration productConfiguration : list ) {
            list1.add( toProductConfigurationDTO( productConfiguration ) );
        }

        return list1;
    }

    private Long productConfigurationProductItemId(ProductConfiguration productConfiguration) {
        if ( productConfiguration == null ) {
            return null;
        }
        ProductItem productItem = productConfiguration.getProductItem();
        if ( productItem == null ) {
            return null;
        }
        Long id = productItem.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String productConfigurationVariationOptionValue(ProductConfiguration productConfiguration) {
        if ( productConfiguration == null ) {
            return null;
        }
        VariationOption variationOption = productConfiguration.getVariationOption();
        if ( variationOption == null ) {
            return null;
        }
        String value = variationOption.getValue();
        if ( value == null ) {
            return null;
        }
        return value;
    }

    private String productConfigurationVariationOptionVariationName(ProductConfiguration productConfiguration) {
        if ( productConfiguration == null ) {
            return null;
        }
        VariationOption variationOption = productConfiguration.getVariationOption();
        if ( variationOption == null ) {
            return null;
        }
        Variation variation = variationOption.getVariation();
        if ( variation == null ) {
            return null;
        }
        String name = variation.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    protected Variation productConfigurationRequestToVariation(ProductConfigurationRequest productConfigurationRequest) {
        if ( productConfigurationRequest == null ) {
            return null;
        }

        Variation variation = new Variation();

        variation.setName( productConfigurationRequest.getVariationName() );

        return variation;
    }

    protected VariationOption productConfigurationRequestToVariationOption(ProductConfigurationRequest productConfigurationRequest) {
        if ( productConfigurationRequest == null ) {
            return null;
        }

        VariationOption variationOption = new VariationOption();

        variationOption.setVariation( productConfigurationRequestToVariation( productConfigurationRequest ) );

        return variationOption;
    }
}
