package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.product.*;
import com.ecomerce.roblnk.mapper.ProductMapper;
import com.ecomerce.roblnk.model.*;
import com.ecomerce.roblnk.repository.*;
import com.ecomerce.roblnk.service.CloudinaryService;
import com.ecomerce.roblnk.service.ProductService;
import com.ecomerce.roblnk.util.ByteMultipartFile;
import com.ecomerce.roblnk.util.FileUtil;
import com.ecomerce.roblnk.util.ImageUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

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

    @Override
    public List<ProductResponse> getAllProduct(Long categoryId) {
        List<Category> categories = new ArrayList<>();
        List<Category> categoryList = new ArrayList<>();
        List<Product> products = new ArrayList<>();
        List<Integer> list = new ArrayList<>();
        var cate = categoryRepository.findAll();
        var cateTarget = categoryRepository.findById(categoryId).orElseThrow();
        categories.add(cateTarget);
        while (!categories.isEmpty()) {
            Long id = categories.get(0).getId();
            boolean flag = false;
            for (Category category : cate) {
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
        for (Product product : products) {
            var items = productItemRepository.findAllByProduct_Id(product.getId());
            for (ProductItem productItem : items) {
                list.add(Math.toIntExact(productItem.getQuantityInStock()));
            }

        }
        var productResponseList = productMapper.toProductResponseList(products);
        for (int i = 0; i < productResponseList.size(); i++) {
            productResponseList.get(i).setQuantity(list.get(i));
        }
        productResponseList.sort((d1, d2) -> d2.getModifiedDate().compareTo(d1.getModifiedDate()));
        return productResponseList;
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

                String optionColor = "";
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

                String optionColor = "";
                String optionSize = "";
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
                Long sizeId = 0L;
                String sizeName = "";
                Long colorId = 0L;
                String colorName = "";
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
                while (!productItemRequests.isEmpty()) {
                    var p = productItemRequests.get(0);
                    ProductItem productItem = new ProductItem();
                    List<ProductConfiguration> productConfigurations = new ArrayList<>();
                    String name = "";
                    var size = variationOptionRepository.findAllByVariation_Id(sizeId);
                    var color = variationOptionRepository.findAllByVariation_Id(colorId);
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
                    productItem.setProduct(product);
                    productItem.setProductImage(getURLPictureAndUploadToCloudinary(productItem.getProductImage()) != null ?
                            getURLPictureAndUploadToCloudinary(productItem.getProductImage()) : ImageUtil.urlImage);
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
                product.setProductImage(getURLPictureAndUploadToCloudinary(product.getProductImage()) != null ?
                        getURLPictureAndUploadToCloudinary(product.getProductImage()) : ImageUtil.urlImage);
                product.setCreatedDate(new Date(System.currentTimeMillis()));
                product.setModifiedDate(new Date(System.currentTimeMillis()));
                product.setActive(true);
                product.setProductItems(productItems);
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
                List<ProductItem> productItems = new ArrayList<>();
                List<ProductItemDTOv2> productItemRequests = productEditRequest.getProductItems();
                List<ProductConfiguration> productConfigurations2 = new ArrayList<>();
                var variations = variationRepository.findVariationsByCategory_Id(productEditRequest.getCategoryId());
                Long sizeId = 0L;
                String sizeName = "";
                Long colorId = 0L;
                String colorName = "";
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
                while (!productItemRequests.isEmpty()) {
                    var p = productItemRequests.get(0);
                    String sizeValueFromRequest = p.getSize();
                    String colorValueFromRequest = p.getColor();
                    var productItem = productItemRepository.findById(p.getId()).orElse(new ProductItem());
                    List<ProductConfiguration> productConfigurations = new ArrayList<>();
                    String name = "";
                    var size = variationOptionRepository.findAllByVariation_Id(sizeId);
                    var color = variationOptionRepository.findAllByVariation_Id(colorId);
                    String sizeValue = "";
                    String colorValue = "";
                    boolean sizeFlag = false;
                    boolean colorFlag = false;
                    Long sizeOptionId = 0L;
                    Long colorOptionId = 0L;
                    loop:
                    {
                        if (!size.isEmpty()) {
                            for (VariationOption variationOption : size) {
                                if (variationOption.getValue().equals(p.getSize())) {
                                    sizeFlag = true;
                                    sizeOptionId = variationOption.getId();
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
                                    colorOptionId = variationOption.getId();
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
                        ProductConfiguration productConfiguration = new ProductConfiguration();
                        productConfiguration.setProductItem(productItem);
                        productConfiguration.setVariationOption(variationOption);
                        productConfigurations.add(productConfiguration);
                    } else {
                        var variationOption = variationOptionRepository.findVariationOptionByVariation_IdAndValueContainingIgnoreCase(sizeId, sizeValueFromRequest);

                        var productConfigurationList = productConfigurationRepository.findAllByProductItem_Id(productItem.getId());
                        if (productConfigurationList.get(0).getVariationOption().getVariation().getName().equals(sizeName)) {
                            productConfigurationList.get(0).setVariationOption(variationOption);
                            productConfigurationList.get(0).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(0));
                        } else {
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
                        ProductConfiguration productConfiguration = new ProductConfiguration();
                        productConfiguration.setProductItem(productItem);
                        productConfiguration.setVariationOption(variationOption);
                        productConfigurations.add(productConfiguration);
                    } else {
                        var variationOption = variationOptionRepository.findVariationOptionByVariation_IdAndValueContainingIgnoreCase(colorId, colorValueFromRequest);
                        System.out.println(variationOption.getId());
                        System.out.println(colorOptionId);
                        var productConfigurationList = productConfigurationRepository.findAllByProductItem_Id(productItem.getId());
                        if (productConfigurationList.get(0).getVariationOption().getVariation().getName().equals(colorName)) {
                            productConfigurationList.get(0).setVariationOption(variationOption);
                            productConfigurationList.get(0).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(0));
                        } else {
                            productConfigurationList.get(1).setVariationOption(variationOption);
                            productConfigurationList.get(1).setProductItem(productItem);
                            productConfigurations.add(productConfigurationList.get(1));
                        }
                    }

                    productItem.setName(productEditRequest.getName() + name);
                    var image = productItem.getProductImage();
                    if (image != null) {
                        productItem.setProductImage(getURLPictureAndUploadToCloudinary(image));
                    } else productItem.setProductImage(ImageUtil.urlImage);

                    productItem.setActive(p.isActive());
                    productItem.setPrice(p.getPrice());
                    productItem.setQuantityInStock(p.getQuantityInStock());
                    productItem.setModifiedDate(new Date(System.currentTimeMillis()));
                    productItem.setProduct(product);
                    productItem.setProductConfigurations(productConfigurations);
                    productItems.add(productItem);
                    productItemRequests.remove(0);
                }

                product.setName(productEditRequest.getName());
                product.setDescription(productEditRequest.getDescription());
                product.setCategory(category.get());
                product.setProductImage(getURLPictureAndUploadToCloudinary(product.getProductImage()) != null ?
                        getURLPictureAndUploadToCloudinary(product.getProductImage()) : ImageUtil.urlImage);
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
    public String deleteProduct(@Valid ProductDeleteRequest productDeleteRequest) {
        var product = productRepository.findById(productDeleteRequest.getId()).orElseThrow();
        var category = categoryRepository.findById(productDeleteRequest.getCategoryId());
        if (category.isEmpty()) {
            return "Not found any category to delete product. Please create category first!";
        }
        var productItems = product.getProductItems();
        List<ProductItem> productItemList = new ArrayList<>();
        if (productDeleteRequest.getListProductItemId().isEmpty()) {
            product.setActive(false);
        }
        for (ProductItem productItem : productItems) {
            loop:
            {
                for (Long id : productDeleteRequest.getListProductItemId()) {
                    if (productItem.getId().equals(id)) {
                        productItem.setActive(false);
                        productItem.setModifiedDate(new Date(System.currentTimeMillis()));
                        productItemList.add(productItem);
                        break loop;
                    }
                }
            }
        }
        product.setModifiedDate(new Date(System.currentTimeMillis()));
        productItemRepository.saveAll(productItemList);
        return "Successfully delete product";
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