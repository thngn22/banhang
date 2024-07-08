package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.PageResponse;
import com.ecomerce.roblnk.dto.product.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProduct(Long categoryId);
    PageResponse getAllProductWithOutFlashSale(Long categoryId, Long sale_id, Integer pageNumber);

    PageResponse getAllProductWithOutFlashSaleCreate(Long categoryId, Integer pageNumber);

    PageResponse getAllProductFilter(Long categoryId, List<String> size, List<String> color, String minPrice, String maxPrice, String search, String sort, Integer pageNumber, boolean isAdmin);

    ProductDetailResponsev3 getDetailProductForAdmin(Long productId);
    ProductDetailResponsev2 getDetailProduct(Long productId);

    String createProduct(@Valid ProductRequest request);

    String createProductFromCategory(Long id, ProductRequest request, @Valid @NotNull MultipartFile[] files);

    String editProduct(ProductEditRequest productEditRequest);

    String deleteProduct(Long productDeleteRequest);

/*    List<ProductResponse> getAllProductV2();

    List<ProductResponse> getAllProductV3();*/

    List<ProductResponse> getAllProductCarouselRating();
    List<ProductResponse> getAllProductCarouselSold();
    List<ProductResponse> getAllProductCarouselInCategory(Long categoryId);
//    String getURLPictureAndUploadToCloudinary(String base64Content);
    String getURLPictureThenUploadToCloudinary(MultipartFile file);

}
