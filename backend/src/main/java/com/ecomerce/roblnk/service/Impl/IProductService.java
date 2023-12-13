package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.order.OrderItemDTO;
import com.ecomerce.roblnk.dto.product.*;
import com.ecomerce.roblnk.mapper.OrderMapper;
import com.ecomerce.roblnk.mapper.ProductMapper;
import com.ecomerce.roblnk.mapper.ReviewMapper;
import com.ecomerce.roblnk.model.*;
import com.ecomerce.roblnk.repository.*;
import com.ecomerce.roblnk.service.*;
import com.ecomerce.roblnk.util.ByteMultipartFile;
import com.ecomerce.roblnk.util.FileUtil;
import com.ecomerce.roblnk.util.ImageUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import static com.ecomerce.roblnk.util.PageUtil.PAGE_SIZE;

@Service
@RequiredArgsConstructor
public class IProductService implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;
    private final ProductItemRepository productItemRepository;
    private final VariationRepository variationRepository;
    private final VariationOptionRepository variationOptionRepository;
    private final ProductConfigurationRepository productConfigurationRepository;
    private final CloudinaryService cloudinaryService;
    private final ReviewMapper reviewMapper;
    private final ReviewService reviewService;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;
    private final CategoryService categoryService;

    @Override
    public List<ProductResponse> getAllProduct(Long categoryId) {
        List<Category> categories = new ArrayList<>();
        List<Category> categoryList = new ArrayList<>();
        List<Product> products = new ArrayList<>();
        List<Integer> list = new ArrayList<>();
        List<Long> cate = new ArrayList<>();
        cate.add(1L);
        cate.add(2L);
        cate.add(21L);
        cate.add(22L);
        var cates = categoryRepository.findAll();
        if (categoryId == null ) {
            categories.addAll(categoryRepository.findAllById(cate));
        } else
            categories.add(categoryRepository.findById(categoryId).orElseThrow());
        while (!categories.isEmpty()) {
            Long id = categories.get(0).getId();
            boolean flag = false;
            for (Category category : cates) {
                if (category.getParentCategoryId() != null && category.getParentCategoryId().getId().equals(id)) {
                    flag = true;
                    categories.add(category);
                }
            }
            if (flag) {
                categories.remove(0);
            } else {
                categoryList.add(categories.get(0));
                categories.remove(0);
            }
        }

        for (Category category : categoryList) {
            products.addAll(productRepository.findAllByCategoryId(category.getId()));
        }

        System.out.println("size đầu: " + products.size());
        for (Product product : products) {
            var items = productItemRepository.findAllByProduct_Id(product.getId());
            for (ProductItem productItem : items) {
                list.add(productItem.getQuantityInStock());
            }

        }
        var productResponseList = productMapper.toProductResponseList(products);
        for (int j = 0; j < productResponseList.size(); j++) {
            productResponseList.get(j).setQuantity(list.get(j));
        }
        return productResponseList;
    }

    @Override
    public PageProductResponse getAllProductFilter(Long categoryId, List<String> size, List<String> color, String minPrice, String maxPrice, String search, String sort, Integer pageNumber) {

        List<Category> categories = new ArrayList<>();
        List<Category> categoryList = new ArrayList<>();
        List<Product> products = new ArrayList<>();
        List<Integer> list = new ArrayList<>();
        List<Long> cate = new ArrayList<>();
        cate.add(1L);
        cate.add(2L);
        cate.add(21L);
        cate.add(22L);
        boolean flagSize = size != null && !size.isEmpty();
        boolean flagColor = color != null && !color.isEmpty();
        boolean flagMinPrice = minPrice != null && !minPrice.isEmpty();
        boolean flagMaxPrice = maxPrice != null && !maxPrice.isEmpty();
        var cates = categoryRepository.findAll();
        if (categoryId == null ) {
            categories.addAll(categoryRepository.findAllById(cate));
        } else
            categories.add(categoryRepository.findById(categoryId).orElseThrow());
        while (!categories.isEmpty()) {
            Long id = categories.get(0).getId();
            boolean flag = false;
            for (Category category : cates) {
                if (category.getParentCategoryId() != null && category.getParentCategoryId().getId().equals(id)) {
                    flag = true;
                    categories.add(category);
                }
            }
            if (flag) {
                categories.remove(0);
            } else {
                categoryList.add(categories.get(0));
                categories.remove(0);
            }
        }

        for (Category category : categoryList) {
            Specification<Product> specification = specification(search, category.getId());
            products.addAll(productRepository.findAll(specification, sort(sort)));
        }


        int i = 0;
        System.out.println("size đầu: " + products.size());
        while (i < products.size()) {
            var items = productItemRepository.findAllByProduct_Id(products.get(i).getId());
            boolean flag = false;
            loop:
            {
                for (ProductItem productItem : items) {
                    if (flagSize && productItem.getProductConfigurations().get(0).getVariationOption().getVariation().getName().startsWith("K")) {
                        if (size.contains(productItem.getProductConfigurations().get(0).getVariationOption().getValue())) {
                            flag = true;
                            System.out.println("dmsize1 " + i);
                            System.out.println(size);
                            System.out.println(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                            break loop;
                        }
                    } else if (flagSize && productItem.getProductConfigurations().get(0).getVariationOption().getVariation().getName().startsWith("M")) {
                        if (size.contains(productItem.getProductConfigurations().get(0).getVariationOption().getValue())) {
                            flag = true;
                            System.out.println("dmsize2 " + i);
                            break loop;
                        }
                    } else if (flagColor && productItem.getProductConfigurations().get(1).getVariationOption().getVariation().getName().startsWith("K")) {
                        if (color.contains(productItem.getProductConfigurations().get(1).getVariationOption().getValue())) {
                            flag = true;
                            System.out.println("dmcolor1 " + i);
                            break loop;
                        }
                    } else if (flagColor && productItem.getProductConfigurations().get(1).getVariationOption().getVariation().getName().startsWith("M")) {
                        if (color.contains(productItem.getProductConfigurations().get(1).getVariationOption().getValue())) {
                            flag = true;
                            System.out.println("dmcolor2 " + i);
                            System.out.println(color);
                            System.out.println(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                            break loop;
                        }

                    } else if (flagMinPrice && flagMaxPrice) {
                        if ((productItem.getPrice() >= Integer.parseInt(minPrice)) && (productItem.getPrice() <= Integer.parseInt(maxPrice))) {
                            System.out.println("dm " + i);
                            flag = true;
                            break loop;
                        }
                    } else if (flagMinPrice) {
                        if (productItem.getPrice() >= Integer.parseInt(minPrice)) {
                            System.out.println("dm1 " + i);

                            flag = true;
                            break loop;
                        }
                    } else if (flagMaxPrice) {
                        if (productItem.getPrice() <= Integer.parseInt(maxPrice)) {
                            System.out.println("dm2 " + i);
                            flag = true;
                            break loop;
                        }

                    }
                }
            }
            System.out.println("flag: " + flag);
            System.out.println("flagColor: " + flagColor);
            System.out.println("flagSize: " + flagSize);
            System.out.println("flagMaxPrice: " + flagMaxPrice);
            System.out.println("flagMinPrice: " + flagMinPrice);
            Boolean temp = (flag || flagColor || flagSize || flagMinPrice || flagMaxPrice) && !flag;
            System.out.println(temp);

            if (!temp) {
                i = i + 1;
            } else
                products.remove(i);
        }
        System.out.println("size cuối: " + products.size());
        for (Product product : products) {
            var items = productItemRepository.findAllByProduct_Id(product.getId());
            for (ProductItem productItem : items) {
                list.add(productItem.getQuantityInStock());
            }

        }


        var productResponseList = productMapper.toProductResponseList(products);
        for (int j = 0; j < productResponseList.size(); j++) {
            productResponseList.get(j).setQuantity(list.get(j));
        }
        switch (sort) {
            case "name_asc" -> productResponseList.sort(Comparator.comparing(ProductResponse::getName));
            case "name_desc" -> productResponseList.sort(Comparator.comparing(ProductResponse::getName).reversed());
            case "new_to_old" -> productResponseList.sort(Comparator.comparing(ProductResponse::getModifiedDate));
            case "old_to_new" ->
                    productResponseList.sort(Comparator.comparing(ProductResponse::getModifiedDate).reversed());
            case "price_asc" -> productResponseList.sort(Comparator.comparing(ProductResponse::getEstimatedPrice));
            case "price_desc" ->
                    productResponseList.sort(Comparator.comparing(ProductResponse::getEstimatedPrice).reversed());
            case "rating_asc" -> productResponseList.sort(Comparator.comparing(ProductResponse::getRating));
            case "rating_desc" -> productResponseList.sort(Comparator.comparing(ProductResponse::getRating).reversed());
            case "sold_asc" -> productResponseList.sort(Comparator.comparing(ProductResponse::getSold));
            case "sold_desc" -> productResponseList.sort(Comparator.comparing(ProductResponse::getSold).reversed());
            default -> productResponseList.sort(Comparator.comparing(ProductResponse::getRating).reversed());
        }

        Pageable pageable = PageRequest.of(Math.max(pageNumber - 1, 0), PAGE_SIZE);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), productResponseList.size());
        System.out.println(start);
        System.out.println(end);
        List<ProductResponse> pageContent = new ArrayList<>();
        if (start < end){
            pageContent = productResponseList.subList(start, end);

        }
        Page<ProductResponse> page = new PageImpl<>(pageContent, pageable, productResponseList.size());
        PageProductResponse productResponse = new PageProductResponse();
        productResponse.setContents(pageContent);
        productResponse.setPageSize(page.getSize());
        productResponse.setPageNumber(page.getNumber() + 1);
        productResponse.setTotalPage(page.getTotalPages());
        productResponse.setTotalElements(page.getTotalElements());
        return productResponse;

    }


    private Specification<Product> specification(String name, Long id) {
        Specification<Product> nameSpec = hasName(name);
        Specification<Product> categorySpec = hasCategoryId(id);
        Specification<Product> specification = Specification.where(null);
        specification = specification.and(categorySpec);
        if (name != null && !name.isEmpty()) {
            specification = specification.and(nameSpec);
        }
        return specification;
    }

    private Specification<Product> hasCategoryId(Long id) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("category").get("id"), id);
    }

    private Specification<Product> hasName(String name) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("name"), "%" + name + "%");
    }

    private Specification<Product> hasDescription(String description) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("description"), "%" + description + "%");
    }

    private Sort sort(String sort) {
        return switch (sort) {
            case "name_asc" -> Sort.by("name").ascending();
            case "name_desc" -> Sort.by("name").descending();
            case "new_to_old" -> Sort.by("modifiedDate").ascending();
            case "old_to_new" -> Sort.by("modifiedDate").descending();
            case "price_asc" -> Sort.by("estimatedPrice").ascending();
            case "price_desc" -> Sort.by("estimatedPrice").descending();
            case "rating_asc" -> Sort.by("rating").ascending();
            case "rating_desc" -> Sort.by("rating").descending();
            case "sold_asc" -> Sort.by("sold").ascending();
            case "sold_desc" -> Sort.by("sold").descending();
            default -> Sort.by("rating").descending();
        };
    }

    @Override
    public ProductDetailResponsev3 getDetailProductForAdmin(Long productId) {
        var product = productRepository.findById(productId);
        if (product.isPresent()) {
            var items = productItemRepository.findAllByProduct_Id(product.get().getId());
            var productDetail = productMapper.toDetailResponse(product.get());
            var totalQuantity = 0;
            for (ProductItem productItem : items) {
                totalQuantity += productItem.getQuantityInStock();
            }
            productDetail.setQuantity(totalQuantity);
            productDetail.setQuantityOfVariation(items.size());
            List<ProductItemDTOv2> productItemDTOv2List = new ArrayList<>();
            while (!productDetail.getProductItems().isEmpty()) {
                System.out.println(productDetail.getProductItems().size());

                String optionColor;
                String optionSize = "";
                if (productDetail.getProductItems().get(0).getProductConfigurations().get(0).getVariationName().startsWith("Màu ")) {
                    optionColor = productDetail.getProductItems().get(0).getProductConfigurations().get(0).getVariationOption();
                } else {
                    optionColor = productDetail.getProductItems().get(0).getProductConfigurations().get(1).getVariationOption();
                }
                ProductItemDTOv2 productItemDTOv2 = new ProductItemDTOv2();
                if (productDetail.getProductItems().get(0).getProductConfigurations().get(0).getVariationName().startsWith("Màu ")
                        && productDetail.getProductItems().get(0).getProductConfigurations().get(0).getVariationOption().equals(optionColor)) {
                    optionSize = productDetail.getProductItems().get(0).getProductConfigurations().get(1).getVariationOption();
                } else if (productDetail.getProductItems().get(0).getProductConfigurations().get(1).getVariationOption().equals(optionColor)) {
                    optionSize = productDetail.getProductItems().get(0).getProductConfigurations().get(0).getVariationOption();

                }
                productItemDTOv2.setId(productDetail.getProductItems().get(0).getId());
                productItemDTOv2.setPrice(productDetail.getProductItems().get(0).getPrice());
                productItemDTOv2.setProductImage(productDetail.getProductItems().get(0).getProductImage());
                productItemDTOv2.setQuantityInStock(productDetail.getProductItems().get(0).getQuantityInStock());
                productItemDTOv2.setActive(productDetail.getProductItems().get(0).isActive());
                productItemDTOv2.setColor(optionColor);
                productItemDTOv2.setSize(optionSize);
                productItemDTOv2List.add(productItemDTOv2);
                productDetail.getProductItems().remove(0);
            }
            var productResponse = productMapper.toProductDetailResponsev3(productDetail);
            productResponse.setProductItems(productItemDTOv2List);
            return productResponse;
        } else
            return null;
    }

    @Override
    public ProductDetailResponsev2 getDetailProduct(Long productId) {
        var product = productRepository.findById(productId);
        if (product.isPresent()) {
            var items = productItemRepository.findAllByProduct_Id(product.get().getId());
            var productDetail = productMapper.toDetailResponse(product.get());
            var totalQuantity = 0;
            for (ProductItem productItem : items) {
                totalQuantity += productItem.getQuantityInStock();
            }
            productDetail.setQuantity(totalQuantity);
            productDetail.setQuantityOfVariation(items.size());
            List<ProductItemResponse> productItemResponses = new ArrayList<>();
            while (!productDetail.getProductItems().isEmpty()) {
                if (!productDetail.getProductItems().get(0).isActive()) {
                    productDetail.getProductItems().remove(0);
                    continue;
                }
                System.out.println(productDetail.getProductItems().size());
                ProductItemResponse productItemResponse = new ProductItemResponse();
                List<ProductItemDTOv3> productItemDTOv3List = new ArrayList<>();
                List<Integer> indexes = new ArrayList<>();

                String optionColor;
                String optionSize;
                if (productDetail.getProductItems().get(0).getProductConfigurations().get(0).getVariationName().startsWith("Màu ")) {
                    optionColor = productDetail.getProductItems().get(0).getProductConfigurations().get(0).getVariationOption();
                } else {
                    optionColor = productDetail.getProductItems().get(0).getProductConfigurations().get(1).getVariationOption();
                }
                productItemResponse.setVariationColor(optionColor);
                for (int i = 0; i < productDetail.getProductItems().size(); i++) {
                    if (productDetail.getProductItems().get(i).getProductConfigurations().get(0).getVariationName().startsWith("Màu ")
                            && productDetail.getProductItems().get(i).getProductConfigurations().get(0).getVariationOption().equals(optionColor)) {
                        optionSize = productDetail.getProductItems().get(i).getProductConfigurations().get(1).getVariationOption();
                        ProductItemDTOv3 productItemDTOv3 = new ProductItemDTOv3();
                        productItemDTOv3.setId(productDetail.getProductItems().get(i).getId());
                        productItemDTOv3.setPrice(productDetail.getProductItems().get(i).getPrice());
                        productItemDTOv3.setProductImage(productDetail.getProductItems().get(i).getProductImage());
                        productItemDTOv3.setQuantityInStock(productDetail.getProductItems().get(i).getQuantityInStock());
                        productItemDTOv3.setActive(productDetail.getProductItems().get(i).isActive());
                        productItemDTOv3.setVariationSize(optionSize);
                        productItemDTOv3List.add(productItemDTOv3);
                        indexes.add(i);
                    } else if (productDetail.getProductItems().get(i).getProductConfigurations().get(1).getVariationOption().equals(optionColor)) {
                        optionSize = productDetail.getProductItems().get(i).getProductConfigurations().get(0).getVariationOption();
                        ProductItemDTOv3 productItemDTOv3 = new ProductItemDTOv3();
                        productItemDTOv3.setId(productDetail.getProductItems().get(i).getId());
                        productItemDTOv3.setPrice(productDetail.getProductItems().get(i).getPrice());
                        productItemDTOv3.setProductImage(productDetail.getProductItems().get(i).getProductImage());
                        productItemDTOv3.setQuantityInStock(productDetail.getProductItems().get(i).getQuantityInStock());
                        productItemDTOv3.setActive(productDetail.getProductItems().get(i).isActive());
                        productItemDTOv3.setVariationSize(optionSize);
                        productItemDTOv3List.add(productItemDTOv3);
                        indexes.add(i);

                    }
                }


                for (int j = 0; j < indexes.size(); j++) {
                    System.out.println(indexes.get(j));
                    productDetail.getProductItems().remove(indexes.get(j) - j);
                }

                productItemResponse.setListProductItem(productItemDTOv3List);
                productItemResponses.add(productItemResponse);
            }
            var productResponse = productMapper.toProductDetailResponsev2(productDetail);
            productResponse.setProductItemResponses(productItemResponses);
            var userReviews = reviewService.findAllByProductId(productId);
            List<Review> reviews = new ArrayList<>();
            List<Long> ids = new ArrayList<>();
            List<Long> orderItemIds = new ArrayList<>();
            for (Review review : userReviews) {
                if (review.getOrderItem().getProductItem().getProduct().getId().equals(productId)) {
                    reviews.add(review);
                    ids.add(review.getOrderItem().getProductItem().getId());
                    orderItemIds.add(review.getOrderItem().getId());
                }
            }
            var reviewResponse = reviewMapper.toReviewResponseForUsers(reviews);

            var userOrders = orderItemRepository.findAllById(orderItemIds);
            var orderDetail = orderMapper.toOrderItemDTOs(userOrders);
            for (OrderItemDTO orderItemDTO : orderDetail) {
                var productItem = productItemRepository.findById(orderItemDTO.getProductItemId()).orElseThrow();
                if (productItem.getProductConfigurations().get(0).getVariationOption().getVariation().getName().startsWith("M")) {
                    orderItemDTO.setColor(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                    orderItemDTO.setSize(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                } else if (productItem.getProductConfigurations().get(1).getVariationOption().getVariation().getName().startsWith("M")) {
                    orderItemDTO.setColor(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                    orderItemDTO.setSize(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                }
            }

            for (int i = 0; i < reviewResponse.size(); i++) {
                reviewResponse.get(i).setColor(orderDetail.get(i).getColor());
                reviewResponse.get(i).setSize(orderDetail.get(i).getSize());
            }
            var reviewList = reviewMapper.toReviewResponseForProducts(reviewResponse);
            productResponse.setReviews(reviewList);
            return productResponse;

        } else
            return null;
    }

    @Override
    public String createProduct(@Valid ProductRequest request) {
        var category = categoryRepository.findById(request.getCategoryId());
        var cateList = categoryRepository.findAllByParentCategoryId_Id(request.getCategoryId());
        if (category.isPresent()) {
            if (cateList.isEmpty()) {
                var product = new Product();
                List<ProductItem> productItems = new ArrayList<>();
                List<ProductItemRequest> productItemRequests = request.getProductItems();
                var variations = variationRepository.findVariationsByCategory_Id(request.getCategoryId());
                Long sizeId;
                String sizeName;
                Long colorId;
                String colorName;
                if (variations.get(0).getName().startsWith("K")) {
                    sizeId = variations.get(0).getId();
                    sizeName = variations.get(0).getName();
                    colorId = variations.get(1).getId();
                    colorName = variations.get(1).getName();
                } else {
                    sizeId = variations.get(1).getId();
                    sizeName = variations.get(1).getName();
                    colorId = variations.get(0).getId();
                    colorName = variations.get(0).getName();

                }
                String productItemImage = "";
                String url = "";
                Integer minPrice = Integer.MAX_VALUE;
                Integer maxPrice = 0;
                while (!productItemRequests.isEmpty()) {
                    var p = productItemRequests.get(0);
                    ProductItem productItem = new ProductItem();
                    List<ProductConfiguration> productConfigurations = new ArrayList<>();
                    String name = "";
                    var size = variationOptionRepository.findAllByVariation_Id(sizeId);
                    var color = variationOptionRepository.findAllByVariation_Id(colorId);
                    if (p.getPrice() > maxPrice) {
                        maxPrice = p.getPrice();
                    }
                    if (p.getPrice() < minPrice) {
                        minPrice = p.getPrice();
                    }

                    String sizeValue = "";
                    String colorValue = "";
                    boolean sizeFlag = false;
                    boolean colorFlag = false;
                    loop:
                    {
                        if (!size.isEmpty()) {
                            for (VariationOption variationOption : size) {
                                if (variationOption.getValue().equals(p.getSize())) {
                                    sizeFlag = true;
                                    sizeValue = variationOption.getValue();
                                    break loop;
                                }
                            }
                        }
                    }
                    loop2:
                    {
                        if (!color.isEmpty()) {
                            for (VariationOption variationOption : color) {
                                if (variationOption.getValue().equals(p.getColor())) {
                                    colorFlag = true;
                                    colorValue = variationOption.getValue();
                                    break loop2;
                                }
                            }
                        }
                    }
                    if (!sizeFlag) {
                        var variation = variationRepository.findVariationByCategory_IdAndNameContaining(request.getCategoryId(), sizeName);
                        VariationOption variationOption = new VariationOption();
                        variationOption.setValue(p.getSize());
                        variationOption.setVariation(variation);
                        variationOption = variationOptionRepository.save(variationOption);
                        ProductConfiguration productConfiguration = new ProductConfiguration();
                        productConfiguration.setProductItem(productItem);
                        productConfiguration.setVariationOption(variationOption);
                        productConfigurations.add(productConfiguration);
                    } else {
                        var variationOption = variationOptionRepository.findVariationOptionByVariation_IdAndValueContainingIgnoreCase(sizeId, sizeValue);
                        ProductConfiguration productConfiguration = new ProductConfiguration();
                        productConfiguration.setProductItem(productItem);
                        productConfiguration.setVariationOption(variationOption);
                        productConfigurations.add(productConfiguration);
                    }
                    if (!colorFlag) {
                        var variation = variationRepository.findVariationByCategory_IdAndNameContaining(request.getCategoryId(), colorName);
                        VariationOption variationOption = new VariationOption();
                        variationOption.setValue(p.getColor());
                        variationOption.setVariation(variation);
                        variationOption = variationOptionRepository.save(variationOption);
                        ProductConfiguration productConfiguration = new ProductConfiguration();
                        productConfiguration.setProductItem(productItem);
                        productConfiguration.setVariationOption(variationOption);
                        productConfigurations.add(productConfiguration);
                    } else {
                        var variationOption = variationOptionRepository.findVariationOptionByVariation_IdAndValueContainingIgnoreCase(colorId, colorValue);
                        ProductConfiguration productConfiguration = new ProductConfiguration();
                        productConfiguration.setProductItem(productItem);
                        productConfiguration.setVariationOption(variationOption);
                        productConfigurations.add(productConfiguration);
                    }

                    productItem.setName(request.getName() + " " + name);
                    productItem.setProductConfigurations(productConfigurations);
                    var image = p.getProductImage();
                    assert productItemImage != null;
                    if (productItemImage.isEmpty()) {
                        productItemImage = image;
                        if (image != null) {
                            url = getURLPictureAndUploadToCloudinary(image);
                        } else url = ImageUtil.urlImage;
                    }
                    if (image != null) {
                        if (!productItemImage.equals(image)) {
                            productItemImage = image;
                            var ImageUrl = getURLPictureAndUploadToCloudinary(image);
                            if (ImageUrl != null) {
                                productItem.setProductImage(ImageUrl);
                                url = ImageUrl;
                            } else url = ImageUtil.urlImage;
                        } else {
                            productItem.setProductImage(url);
                        }

                    } else productItem.setProductImage(ImageUtil.urlImage);
                    productItem.setActive(true);
                    productItem.setCreatedDate(new Date(System.currentTimeMillis()));
                    productItem.setModifiedDate(new Date(System.currentTimeMillis()));
                    productItem.setPrice(p.getPrice());
                    productItem.setQuantityInStock(p.getQuantityInStock());
                    productItems.add(productItem);
                    productItemRequests.remove(0);
                }

                product.setName(request.getName());
                product.setProductItems(productItems);
                product.setDescription(request.getDescription());
                product.setCategory(category.get());
                var image = request.getProductImage();
                if (image != null) {
                    var urlImage = getURLPictureAndUploadToCloudinary(image);
                    product.setProductImage(urlImage != null ? urlImage : ImageUtil.urlImage);
                } else product.setProductImage(ImageUtil.urlImage);
                product.setCreatedDate(new Date(System.currentTimeMillis()));
                product.setModifiedDate(new Date(System.currentTimeMillis()));
                product.setActive(true);
                product.setProductItems(productItems);
                if (!minPrice.equals(maxPrice)) {

                    product.setEstimatedPrice(minPrice + " - " + maxPrice);
                } else {
                    product.setEstimatedPrice(minPrice.toString());
                }
                productRepository.save(product);

                return "Successfully save product";
            } else
                return "This category is not available to create product. Please try a sub-category of this category or another!";
        } else
            return "Not found any category to create product. Please create category first!";

    }

    @Override
    public String createProductFromCategory(Long id, ProductRequest request) {
        var category = categoryRepository.findById(id);
        var cate = request.getCategoryId();
        if (category.isPresent() && category.get().getId().equals(cate)) {
            return createProduct(request);
        } else
            return "This category is not available to create product. Please try a sub-category of this category or another!";
    }

    @Override
    public String editProduct(ProductEditRequest productEditRequest) {
        var category = categoryRepository.findById(productEditRequest.getCategoryId());
        var cateList = categoryRepository.findAllByParentCategoryId_Id(productEditRequest.getCategoryId());
        if (category.isPresent()) {
            if (cateList.isEmpty()) {
                var product = productRepository.findById(productEditRequest.getId()).orElseThrow();
                List<ProductItemDTOv2> productItemRequests = productEditRequest.getProductItems();
                var variations = variationRepository.findVariationsByCategory_Id(productEditRequest.getCategoryId());
                Long sizeId;
                String sizeName;
                Long colorId;
                String colorName;
                if (variations.get(0).getName().startsWith("K")) {
                    sizeId = variations.get(0).getId();
                    sizeName = variations.get(0).getName();
                    colorId = variations.get(1).getId();
                    colorName = variations.get(1).getName();
                } else {
                    sizeId = variations.get(1).getId();
                    sizeName = variations.get(1).getName();
                    colorId = variations.get(0).getId();
                    colorName = variations.get(0).getName();

                }
                String productItemImage = "";
                String url = "";
                Integer minPrice = Integer.MAX_VALUE;
                Integer maxPrice = 0;
                while (!productItemRequests.isEmpty()) {
                    var p = productItemRequests.get(0);
                    String sizeValueFromRequest = p.getSize();
                    String colorValueFromRequest = p.getColor();
                    var productItem = productItemRepository.findById(p.getId()).orElse(new ProductItem());
                    List<ProductConfiguration> productConfigurations = new ArrayList<>();
                    String name = "";
                    var size = variationOptionRepository.findAllByVariation_Id(sizeId);
                    var color = variationOptionRepository.findAllByVariation_Id(colorId);
                    boolean sizeFlag = false;
                    boolean colorFlag = false;
                    if (p.getPrice() > maxPrice) {
                        maxPrice = p.getPrice();
                    }
                    if (p.getPrice() < minPrice) {
                        minPrice = p.getPrice();
                    }
                    loop:
                    {
                        if (!size.isEmpty()) {
                            for (VariationOption variationOption : size) {
                                if (variationOption.getValue().equals(p.getSize())) {
                                    sizeFlag = true;
                                    break loop;
                                }
                            }
                        }
                    }
                    loop2:
                    {
                        if (!color.isEmpty()) {
                            for (VariationOption variationOption : color) {
                                if (variationOption.getValue().equals(p.getColor())) {
                                    colorFlag = true;
                                    break loop2;
                                }
                            }
                        }
                    }
                    if (!sizeFlag) {
                        var variation = variationRepository.findVariationByCategory_IdAndNameContaining(productEditRequest.getCategoryId(), sizeName);
                        VariationOption variationOption = new VariationOption();
                        variationOption.setValue(p.getSize());
                        variationOption.setVariation(variation);
                        variationOption = variationOptionRepository.save(variationOption);

                        var productConfigurationList = productConfigurationRepository.findAllByProductItem_Id(productItem.getId());
                        if (productConfigurationList.get(0).getVariationOption().getVariation().getName().equals(sizeName)) {
                            productConfigurationList.get(0).setVariationOption(variationOption);
                            productConfigurationList.get(0).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(0));
                        } else if (productConfigurationList.get(1).getVariationOption().getVariation().getName().equals(sizeName)) {
                            productConfigurationList.get(1).setVariationOption(variationOption);
                            productConfigurationList.get(1).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(1));
                        }
                    } else {
                        var variationOption = variationOptionRepository.findVariationOptionByVariation_IdAndValueContainingIgnoreCase(sizeId, sizeValueFromRequest);

                        var productConfigurationList = productConfigurationRepository.findAllByProductItem_Id(productItem.getId());
                        if (productConfigurationList.get(0).getVariationOption().getVariation().getName().equals(sizeName)) {
                            productConfigurationList.get(0).setVariationOption(variationOption);
                            productConfigurationList.get(0).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(0));
                        } else if (productConfigurationList.get(1).getVariationOption().getVariation().getName().equals(colorName)) {
                            productConfigurationList.get(1).setVariationOption(variationOption);
                            productConfigurationList.get(1).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(1));
                        }

                    }
                    if (!colorFlag) {
                        var variation = variationRepository.findVariationByCategory_IdAndNameContaining(productEditRequest.getCategoryId(), colorName);
                        VariationOption variationOption = new VariationOption();
                        variationOption.setValue(p.getColor());
                        variationOption.setVariation(variation);
                        variationOption = variationOptionRepository.save(variationOption);

                        var productConfigurationList = productConfigurationRepository.findAllByProductItem_Id(productItem.getId());
                        if (productConfigurationList.get(0).getVariationOption().getVariation().getName().equals(colorName)) {
                            productConfigurationList.get(0).setVariationOption(variationOption);
                            productConfigurationList.get(0).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(0));
                        } else if (productConfigurationList.get(1).getVariationOption().getVariation().getName().equals(colorName)) {
                            productConfigurationList.get(1).setVariationOption(variationOption);
                            productConfigurationList.get(1).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(1));
                        }
                    } else {
                        var variationOption = variationOptionRepository.findVariationOptionByVariation_IdAndValueContainingIgnoreCase(colorId, colorValueFromRequest);

                        var productConfigurationList = productConfigurationRepository.findAllByProductItem_Id(productItem.getId());
                        if (productConfigurationList.get(0).getVariationOption().getVariation().getName().equals(colorName)) {
                            productConfigurationList.get(0).setVariationOption(variationOption);
                            productConfigurationList.get(0).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(0));
                        } else if (productConfigurationList.get(1).getVariationOption().getVariation().getName().equals(colorName)) {
                            productConfigurationList.get(1).setVariationOption(variationOption);
                            productConfigurationList.get(1).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(1));
                        }
                    }

                    productItem.setName(productEditRequest.getName() + name);
                    var image = p.getProductImage();
                    if (productItemImage != null && productItemImage.isEmpty()) {
                        productItemImage = image;
                        if (image != null) {
                            url = getURLPictureAndUploadToCloudinary(image);
                        } else url = ImageUtil.urlImage;
                    }
                    if (image != null) {
                        if (!productItemImage.equals(image)) {
                            productItemImage = image;
                            var ImageUrl = getURLPictureAndUploadToCloudinary(image);
                            if (ImageUrl != null) {
                                productItem.setProductImage(ImageUrl);
                                url = ImageUrl;
                            } else url = ImageUtil.urlImage;
                        } else {
                            productItem.setProductImage(url);
                        }

                    } else productItem.setProductImage(ImageUtil.urlImage);
                    productItem.setActive(p.isActive());
                    productItem.setPrice(p.getPrice());
                    productItem.setQuantityInStock(p.getQuantityInStock());
                    productItem.setModifiedDate(new Date(System.currentTimeMillis()));
                    productItem.setProduct(product);
                    productItem.setProductConfigurations(productConfigurations);
                    productItemRequests.remove(0);
                }

                product.setName(productEditRequest.getName());
                product.setDescription(productEditRequest.getDescription());
                product.setCategory(category.get());
                var image = productEditRequest.getProductImage();
                if (image != null) {
                    var urlImage = getURLPictureAndUploadToCloudinary(image);
                    if (urlImage != null) {
                        product.setProductImage(urlImage);
                    }
                }
                if (!minPrice.equals(maxPrice)) {

                    product.setEstimatedPrice(minPrice + " - " + maxPrice);
                } else {
                    product.setEstimatedPrice(minPrice.toString());
                }
                product.setModifiedDate(new Date(System.currentTimeMillis()));
                product.setActive(true);
                productRepository.save(product);

                return "Successfully update product";
            } else
                return "This category is not available to update product. Please try a sub-category of this category or another!";
        } else
            return "Not found any category to update product. Please create category first!";
    }

    @Override
    public String deleteProduct(@Valid Long id) {
        var product = productRepository.findById(id);
        if (product.isPresent()) {
            product.get().setModifiedDate(new Date(System.currentTimeMillis()));
            if (product.get().isActive()) {
                product.get().setActive(false);
                productRepository.save(product.get());
                return "Successfully deactive product";
            } else {
                product.get().setActive(true);
                productRepository.save(product.get());
                return "Successfully active product";
            }
        } else
            return "Product not found or not available to delete!";
    }

    @Override
    public List<ProductResponse> getAllProductV2() {
        var products = productRepository.findAll();
        List<Integer> list = new ArrayList<>();

        for (Product product : products) {
            int total = 0;
            var items = productItemRepository.findAllByProduct_Id(product.getId());
            for (ProductItem productItem : items) {
                total += productItem.getQuantityInStock();
            }

            list.add(total);
        }
        var productResponseList = productMapper.toProductResponseList(products);
        for (int i = 0; i < productResponseList.size(); i++) {
            productResponseList.get(i).setQuantity(list.get(i));
        }
        productResponseList.sort((d1, d2) -> d2.getModifiedDate().compareTo(d1.getModifiedDate()));
        return productResponseList;
    }

    @Override
    public List<ProductResponse> getAllProductV3() {
        var products = getAllProductV2();
        List<ProductResponse> list = new ArrayList<>();
        for (ProductResponse productResponse : products) {
            if (productResponse.isActive()) {
                list.add(productResponse);
            }
        }
        return list;
    }

    @Override
    public String getURLPictureAndUploadToCloudinary(String base64Content) {
        try {
            byte[] fileBytes = FileUtil.base64ToBytes(base64Content);
            MultipartFile multipartFile = new ByteMultipartFile(fileBytes);
            Tika tika = new Tika();
            String mimetype = tika.detect(fileBytes);
            if (mimetype.contains("image")) {
                Map<?, ?> map = cloudinaryService.uploadFile(multipartFile, "Product");
                return (String) map.get("secure_url");

            } else
                return ImageUtil.urlImage;
        } catch (Exception exception) {
            return null;
        }

    }

}
