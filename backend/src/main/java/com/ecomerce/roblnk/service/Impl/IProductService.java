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
                if (!productDetail.getProductItems().get(0).isActive()){
                    productDetail.getProductItems().remove(0);
                    continue;
                }
                System.out.println(productDetail.getProductItems().size());
                ProductItemResponse productItemResponse = new ProductItemResponse();
                List<ProductItemDTOv3> productItemDTOv3List = new ArrayList<>();
                List<Integer> indexes = new ArrayList<>();

                String optionColor = "";
                String optionSize = "";
                if (productDetail.getProductItems().get(0).getProductConfigurations().get(0).getVariationName().startsWith("Color")) {
                    optionColor = productDetail.getProductItems().get(0).getProductConfigurations().get(0).getVariationOption();
                } else {
                    optionColor = productDetail.getProductItems().get(0).getProductConfigurations().get(1).getVariationOption();
                }
                productItemResponse.setVariationColor(optionColor);
                for (int i = 0; i < productDetail.getProductItems().size(); i++) {
                    if (productDetail.getProductItems().get(i).getProductConfigurations().get(0).getVariationName().startsWith("Color")
                            && productDetail.getProductItems().get(i).getProductConfigurations().get(0).getVariationOption().equals(optionColor)) {
                        optionSize = productDetail.getProductItems().get(i).getProductConfigurations().get(1).getVariationOption();
                        ProductItemDTOv3 productItemDTOv3 = new ProductItemDTOv3();
                        productItemDTOv3.setId(productDetail.getProductItems().get(i).getId());
                        productItemDTOv3.setPrice(productDetail.getProductItems().get(i).getPrice());
                        productItemDTOv3.setProductImage(productDetail.getProductItems().get(i).getProductImage());
                        productItemDTOv3.setQuantityInStock(productDetail.getProductItems().get(i).getQuantityInStock());
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
        var category = categoryRepository.findById(request.getProductCreateRequest().getCategoryId());
        var cateList = categoryRepository.findAllByParentCategoryId_Id(request.getProductCreateRequest().getCategoryId());
        if (category.isPresent()) {
            if (cateList.isEmpty()) {
                var product = productMapper.toEntityProduct(request.getProductCreateRequest());
                List<ProductItem> productItems = new ArrayList<>();
                List<ProductItemRequest> productItemRequests = request.getProductItems();
                var variations = variationRepository.findVariationsByCategory_Id(request.getProductCreateRequest().getCategoryId());
                for (ProductItemRequest p : productItemRequests) {
                    ProductItem productItem = productMapper.toProductItem(p);
                    List<ProductConfiguration> productConfigurations = new ArrayList<>();
                    List<Variation> variationList = new ArrayList<>();
                    List<VariationOption> variationOptions = new ArrayList<>();
                    String name = "";
                    for (ProductConfigurationRequest pro : p.getProductConfigurations()) {

                        boolean flag = false;
                        var variationName = "";
                        Long variationId = 0L;
                        name = " " + pro.getVariationName() + " " + pro.getVariationOption();
                        loop:
                        {
                            for (Variation variation : variations) {
                                if (variation.getName().equals(pro.getVariationName())) {
                                    flag = true;
                                    variationName = variation.getName();
                                    variationId = variation.getId();
                                    break loop;
                                }
                            }
                        }
                        if (flag) {
                            System.out.println(variationName);
                            var variation = variationRepository.findById(variationId).orElseThrow();
                            boolean miniFlag = false;
                            var variationOptionValue = "";
                            var variationOptionId = 0L;
                            miniLoop:
                            {
                                for (VariationOption variationOption : variation.getVariationOptions()) {
                                    if (variationOption.getValue().equals(pro.getVariationOption())) {
                                        miniFlag = true;
                                        variationOptionId = variationOption.getId();
                                        variationOptionValue = variationOption.getValue();
                                        break miniLoop;
                                    }
                                }
                            }

                            if (miniFlag) {
                                System.out.println(variationOptionValue);
                                var variationOption = variationOptionRepository.findById(variationOptionId).orElseThrow();

                                ProductConfiguration productConfiguration1 = new ProductConfiguration();
                                productConfiguration1.setVariationOption(variationOption);
                                productConfiguration1.setProductItem(productItem);
                                productConfigurations.add(productConfiguration1);


                            } else {
                                System.out.println(variationOptionValue);
                                System.out.println("tao moi voi variationId: " + variationId);
                                //tao variation option moi
                                var variationParent = variationRepository.findById(variationId).orElseThrow();
                                VariationOption variationOption = new VariationOption();
                                ProductConfiguration productConfiguration = new ProductConfiguration();
                                variationOption.setVariation(variationParent);
                                variationOption.setValue(pro.getVariationOption());
                                productConfiguration.setProductItem(productItem);
                                productConfiguration.setVariationOption(variationOption);
                                productConfigurations.add(productConfiguration);
                                variationOptions.add(variationOption);
                            }
                        } else {
                            //Tao variation moi
                            Variation variation = new Variation();
                            VariationOption variationOption = new VariationOption();
                            ProductConfiguration productConfiguration = new ProductConfiguration();
                            variation.setCategory(category.get());
                            variation.setName(pro.getVariationName());
                            variationOption.setValue(pro.getVariationOption());
                            variationOption.setVariation(variation);
                            productConfiguration.setVariationOption(variationOption);
                            productConfiguration.setProductItem(productItem);
                            productConfigurations.add(productConfiguration);
                            variationOptions.add(variationOption);
                            variationList.add(variation);
                        }

                    }
                    category.get().getVariations().addAll(variationList);
                    productItem.setName(request.getProductCreateRequest().getName() + " " + name);
                    productItem.setProductConfigurations(productConfigurations);
                    productItem.setProduct(product);
                    productItem.setProductImage(getURLPictureAndUploadToCloudinary(productItem.getProductImage()) != null ?
                            getURLPictureAndUploadToCloudinary(productItem.getProductImage()) : ImageUtil.urlImage);
                    productItem.setActive(true);
                    productItem.setCreatedDate(new Date(System.currentTimeMillis()));
                    productItem.setModifiedDate(new Date(System.currentTimeMillis()));
                    var productConfigs = productItem.getProductConfigurations();
                    System.out.println("Size: " + productConfigs.size() + ", size productConfiguration: " + productConfigurations.size());
                    System.out.println("Value: " + productConfigs.get(0).getVariationOption().getValue() + ", value productConfiguration: " + productConfigurations.get(0).getVariationOption().getValue());
                    System.out.println("Value: " + productConfigs.get(1).getVariationOption().getValue() + ", value productConfiguration: " + productConfigurations.get(1).getVariationOption().getValue());
                    System.out.println("Name: " + productConfigs.get(0).getVariationOption().getVariation().getName() + ", name productConfiguration: " + productConfigurations.get(0).getVariationOption().getVariation().getName());
                    System.out.println("Name: " + productConfigs.get(1).getVariationOption().getVariation().getName() + ", name productConfiguration: " + productConfigurations.get(1).getVariationOption().getVariation().getName());

                    System.out.println(variationList.size());
                    System.out.println(variationOptions.size());
                    System.out.println(productConfigurations.size());

                    if (!variationList.isEmpty()) {
                        productItemRepository.save(productItem);
                        variationRepository.saveAll(variationList);
                        variationOptionRepository.saveAll(variationOptions);
                        productConfigurationRepository.saveAll(productConfigurations);
                    } else if (!variationOptions.isEmpty()) {
                        productItemRepository.save(productItem);
                        variationOptionRepository.saveAll(variationOptions);
                        productConfigurationRepository.saveAll(productConfigurations);
                    } else {
                        productItemRepository.save(productItem);
                        productConfigurationRepository.saveAll(productConfigurations);
                    }


                    productItems.add(productItem);
                }

                product.setName(request.getProductCreateRequest().getName());
                product.setProductItems(productItems);
                product.setDescription(request.getProductCreateRequest().getDescription());
                product.setCategory(category.get());
                product.setProductImage(ImageUtil.urlImage);
                product.setCreatedDate(new Date(System.currentTimeMillis()));
                product.setModifiedDate(new Date(System.currentTimeMillis()));
                product.setActive(true);
                productRepository.save(product);
                categoryRepository.save(category.get());
                return "Successfully save product";
            } else
                return "This category is not available to create product. Please try a sub-category of this category or another!";
        } else
            return "Not found any category to create product. Please create category first!";

    }

    @Override
    public String createProductFromCategory(Long id, ProductRequest request) {
        var category = categoryRepository.findById(id);
        var cate = request.getProductCreateRequest().getCategoryId();
        if (category.isPresent() && category.get().getId().equals(cate)) {
            return createProduct(request);
        } else
            return "This category is not available to create product. Please try a sub-category of this category or another!";
    }

    @Override
    public String editProduct(ProductEditRequest productEditRequest) {
        var category = categoryRepository.findById(productEditRequest.getProductDTO().getCategoryId());
        var cateList = categoryRepository.findAllByParentCategoryId_Id(productEditRequest.getProductDTO().getCategoryId());
        if (category.isPresent()) {
            if (cateList.isEmpty()) {
                var product = productRepository.findById(productEditRequest.getProductDTO().getId()).orElseThrow();
                List<ProductItem> productItems = new ArrayList<>();
                List<ProductItemDTOv2> productItemRequests = productEditRequest.getProductItems();
                var variations = variationRepository.findVariationsByCategory_Id(productEditRequest.getProductDTO().getCategoryId());
                for (ProductItemDTOv2 p : productItemRequests) {
                    var productItem = productItemRepository.findById(p.getId()).orElse(new ProductItem());
                    List<ProductConfiguration> productConfigurations = new ArrayList<>();
                    List<Variation> variationList = new ArrayList<>();
                    List<VariationOption> variationOptions = new ArrayList<>();
                    String name = "";
                    for (ProductConfigurationDTO pro : p.getProductConfigurations()) {

                        boolean flag = false;
                        var variationName = "";
                        Long variationId = 0L;
                        name = " " + pro.getVariationName() + " " + pro.getVariationOption();
                        loop:
                        {
                            for (Variation variation : variations) {
                                if (variation.getName().equals(pro.getVariationName())) {
                                    flag = true;
                                    variationName = variation.getName();
                                    variationId = variation.getId();
                                    break loop;
                                }
                            }
                        }
                        if (flag) {
                            System.out.println(variationName);
                            var variation = variationRepository.findById(variationId).orElseThrow();
                            boolean miniFlag = false;
                            var variationOptionValue = "";
                            var variationOptionId = 0L;
                            miniLoop:
                            {
                                for (VariationOption variationOption : variation.getVariationOptions()) {
                                    if (variationOption.getValue().equals(pro.getVariationOption())) {
                                        miniFlag = true;
                                        variationOptionId = variationOption.getId();
                                        variationOptionValue = variationOption.getValue();
                                        break miniLoop;
                                    }
                                }
                            }

                            if (miniFlag) {
                                System.out.println("variationOption: " + variationOptionValue);
                                System.out.println("productItem: " + productItem.getId());
                                System.out.println("variationOptionId: " + variationOptionId);
                                var variationOption = variationOptionRepository.findById(variationOptionId).orElseThrow();
                                var productConfiguration = productConfigurationRepository.findProductConfigurationByProductItem_IdAndVariationOption_Id(pro.getProductItemId(), variationOptionId);
                                if (productConfiguration.isEmpty()) {
                                    ProductConfiguration productConfiguration1 = new ProductConfiguration();
                                    productConfiguration1.setVariationOption(variationOption);
                                    productConfiguration1.setProductItem(productItem);
                                    productConfigurations.add(productConfiguration1);
                                } else {
                                    productConfigurations.add(productConfiguration.get());
                                    variationOption.getProductConfigurations().add(productConfiguration.get());
                                }


                            } else {
                                System.out.println(variationOptionValue);
                                System.out.println("tao moi voi variationId: " + variationId);
                                //tao variation option moi
                                var variationParent = variationRepository.findById(variationId).orElseThrow();
                                VariationOption variationOption = new VariationOption();
                                ProductConfiguration productConfiguration = new ProductConfiguration();
                                variationOption.setVariation(variationParent);
                                variationOption.setValue(pro.getVariationOption());
                                productConfiguration.setProductItem(productItem);
                                productConfiguration.setVariationOption(variationOption);
                                productConfigurations.add(productConfiguration);
                                variationOptions.add(variationOption);

                            }
                        } else {
                            //Tao variation moi
                            Variation variation = new Variation();
                            VariationOption variationOption = new VariationOption();
                            ProductConfiguration productConfiguration = new ProductConfiguration();
                            variation.setCategory(category.get());
                            variation.setName(pro.getVariationName());
                            variationOption.setValue(pro.getVariationOption());
                            variationOption.setVariation(variation);
                            productConfiguration.setVariationOption(variationOption);
                            productConfiguration.setProductItem(productItem);
                            productConfigurations.add(productConfiguration);
                            variationOptions.add(variationOption);
                            variationList.add(variation);
                        }

                    }
                    category.get().getVariations().addAll(variationList);

                    productItem.setName(productEditRequest.getProductDTO().getName() + name);
                    productItem.setProduct(product);
                    productItem.setProductImage(getURLPictureAndUploadToCloudinary(p.getProductImage()) != null ?
                            getURLPictureAndUploadToCloudinary(p.getProductImage()) : ImageUtil.urlImage);
                    productItem.setActive(p.isActive());
                    productItem.setPrice(p.getPrice());
                    productItem.setQuantityInStock(p.getQuantityInStock());
                    productItem.setModifiedDate(new Date(System.currentTimeMillis()));
                    List<ProductConfiguration> p2 = new ArrayList<>();
                    var productConfigs = productItem.getProductConfigurations();
                    System.out.println("Size: " + productConfigs.size());
                    while (!productConfigs.isEmpty()) {
                        var pad = productConfigs.get(0);
                        System.out.println("value: pad" + pad.getVariationOption().getValue());
                        boolean flag = false;

                        for (ProductConfiguration pad1 : productConfigurations) {
                            if (pad.getVariationOption().getValue().equals(pad1.getVariationOption().getValue())) {
                                flag = true;
                                System.out.println("value: pad to change" + pad.getVariationOption().getValue());
                                System.out.println(pad.getVariationOption().getValue());
                                var variation = pad.getVariationOption();
                                variation.getProductConfigurations().add(pad);
                                pad.setVariationOption(pad1.getVariationOption());
                                System.out.println(pad.getVariationOption().getValue());
                                p2.add(pad);
                            }
                        }

                        if (!flag) {
                            lmao:
                            {
                                for (ProductConfiguration pad1 : productConfigurations) {
                                    if (pad.getVariationOption().getVariation().getName().equals(pad1.getVariationOption().getVariation().getName())) {
                                        System.out.println("value con: " + pad.getVariationOption().getValue());
                                        var variation = pad.getVariationOption();
                                        variation.getProductConfigurations().add(pad);
                                        pad.setVariationOption(pad1.getVariationOption());
                                        System.out.println(pad.getVariationOption().getValue());
                                        p2.add(pad);
                                        break lmao;
                                    }
                                }
                            }


                        }
                        productConfigs.remove(0);
                    }
                    System.out.println(variationList.size());
                    System.out.println(variations.size());
                    System.out.println(p2.size());

                    if (!variationList.isEmpty()) {
                        variationOptionRepository.saveAll(variationOptions);
                        productItemRepository.save(productItem);
                        variationRepository.saveAll(variationList);
                        productConfigurationRepository.saveAll(p2);
                    } else if (!variationOptions.isEmpty()) {
                        variationOptionRepository.saveAll(variationOptions);
                        productItemRepository.save(productItem);
                        productConfigurationRepository.saveAll(p2);
                    } else {
                        productItemRepository.save(productItem);
                        productConfigurationRepository.saveAll(p2);
                    }

                    productItems.add(productItem);
                }
                product.setActive(productEditRequest.getProductDTO().isActive());
                product.setProductItems(productItems);
                product.setDescription(productEditRequest.getProductDTO().getDescription());
                product.setName(productEditRequest.getProductDTO().getName());
                product.setCategory(category.get());
                product.setProductImage(getURLPictureAndUploadToCloudinary(productEditRequest.getProductDTO().getProductImage()) != null ?
                        getURLPictureAndUploadToCloudinary(productEditRequest.getProductDTO().getProductImage()) : ImageUtil.urlImage);
                product.setModifiedDate(new Date(System.currentTimeMillis()));
                productRepository.save(product);
                categoryRepository.save(category.get());
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