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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
            list.add(items.size());
        }
        var productResponseList = productMapper.toProductResponseList(products);
        for (int i = 0; i < productResponseList.size(); i++) {
            productResponseList.get(i).setQuantity(list.get(i));
        }
        return productResponseList;
    }

    @Override
    public ProductDetailResponse getDetailProduct(Long productId) {
        var product = productRepository.findById(productId);
        if (product.isPresent()) {
            var items = productItemRepository.findAllByProduct_Id(product.get().getId());
            var productDetail = productMapper.toDetailResponse(product.get());
            productDetail.setQuantity(items.size());
            return productDetail;
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
                for (ProductItemRequest p : productItemRequests){
                    ProductItem productItem = productMapper.toProductItem(p);
                    List<ProductConfiguration> productConfigurations = new ArrayList<>();
                    List<Variation> variationList = new ArrayList<>();
                    List<VariationOption> variationOptions = new ArrayList<>();
                   for (ProductConfigurationRequest pro : p.getProductConfigurations()){

                       boolean flag = false;
                       var variationName = "";
                       Long variationId = 0L;
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
                        if (flag){
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

                            if (miniFlag){
                                System.out.println(variationOptionValue);
                                var variationOption = variationOptionRepository.findById(variationOptionId).orElseThrow();
                                ProductConfiguration productConfiguration = new ProductConfiguration();
                                productConfiguration.setVariationOption(variationOption);
                                productConfiguration.setProductItem(productItem);
                                variationOption.getProductConfigurations().add(productConfiguration);
                                productConfigurations.add(productConfiguration);
                            }
                            else {
                                System.out.println(variationOptionValue);
                                System.out.println("tao moi voi variationId: " + variationId);
                                //tao variation option moi
                                var variationParent = variationRepository.findById(variationId).orElseThrow();
                                VariationOption variationOption = new VariationOption();
                                variationOption.setVariation(variationParent);
                                variationOption.setValue(pro.getVariationOption());
                                variationOptionRepository.save(variationOption);
                                ProductConfiguration productConfiguration = new ProductConfiguration();
                                productConfiguration.setVariationOption(variationOption);
                                productConfiguration.setProductItem(productItem);
                                productConfigurations.add(productConfiguration);
                                variationOption.setProductConfigurations(productConfigurations);
                                variationOptions.add(variationOption);
                            }
                        }
                        else {
                            //Tao variation moi
                            Variation variation = new Variation();
                            variation.setCategory(category.get());
                            variation.setName(pro.getVariationName());
                            variationRepository.save(variation);
                            VariationOption variationOption = new VariationOption();
                            variationOption.setValue(pro.getVariationOption());
                            variationOption.setVariation(variation);
                            variationOptionRepository.save(variationOption);
                            ProductConfiguration productConfiguration = new ProductConfiguration();
                            productConfiguration.setVariationOption(variationOption);
                            productConfiguration.setProductItem(productItem);
                            productConfigurations.add(productConfiguration);
                            variationOption.setProductConfigurations(productConfigurations);
                            variationOptions.add(variationOption);
                            variation.setVariationOptions(variationOptions);
                            variationList.add(variation);
                        }

                   }
                    category.get().getVariations().addAll(variationList);
                    productItem.setProductConfigurations(productConfigurations);
                    productItem.setProduct(product);
                    productItem.setProductImage(getURLPictureAndUploadToCloudinary(productItem.getProductImage()));
                    productItem.setActive(true);
                    productItemRepository.save(productItem);
                    variationRepository.saveAll(variationList);
                    variationOptionRepository.saveAll(variationOptions);
                    productConfigurationRepository.saveAll(productConfigurations);

                    productItems.add(productItem);
                }

                product.setProductItems(productItems);
                product.setCategory(category.get());
                product.setProductImage(ImageUtil.urlImage);
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
        if (category.isPresent() && category.get().getId().equals(cate)){
            return createProduct(request);
        }
        else
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
                List<ProductItemDTO> productItemRequests = productEditRequest.getProductItems();
                var variations = variationRepository.findVariationsByCategory_Id(productEditRequest.getProductDTO().getCategoryId());
                for (ProductItemDTO p : productItemRequests){
                    var productItem = productItemRepository.findById(p.getId()).orElse(new ProductItem());
                    List<ProductConfiguration> productConfigurations = new ArrayList<>();
                    List<Variation> variationList = new ArrayList<>();
                    List<VariationOption> variationOptions = new ArrayList<>();
                    for (ProductConfigurationDTO pro : p.getProductConfigurations()){

                        boolean flag = false;
                        var variationName = "";
                        Long variationId = 0L;
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
                        if (flag){
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

                            if (miniFlag){
                                System.out.println(variationOptionValue);
                                var variationOption = variationOptionRepository.findById(variationOptionId).orElseThrow();
                                var productConfiguration = productConfigurationRepository.findAllByProductItem_IdAndVariationOption_Id(pro.getProductItemId(), variationOptionId);
                                if (productConfiguration.isEmpty()){
                                    ProductConfiguration productConfiguration1 = new ProductConfiguration();
                                    productConfiguration1.setVariationOption(variationOption);
                                    productConfiguration1.setProductItem(productItem);
                                    variationOption.getProductConfigurations().add(productConfiguration1);
                                    productConfigurations.add(productConfiguration1);
                                }
                                else {
                                    productConfigurations.add(productConfiguration.get());
                                }

                            }
                            else {
                                System.out.println(variationOptionValue);
                                System.out.println("tao moi voi variationId: " + variationId);
                                //tao variation option moi
                                var variationParent = variationRepository.findById(variationId).orElseThrow();
                                VariationOption variationOption = new VariationOption();
                                variationOption.setVariation(variationParent);
                                variationOption.setValue(pro.getVariationOption());
                                variationOptionRepository.save(variationOption);
                                ProductConfiguration productConfiguration = new ProductConfiguration();
                                productConfiguration.setVariationOption(variationOption);
                                productConfiguration.setProductItem(productItem);
                                productConfigurations.add(productConfiguration);
                                variationOption.setProductConfigurations(productConfigurations);
                                variationOptions.add(variationOption);
                            }
                        }
                        else {
                            //Tao variation moi
                            Variation variation = new Variation();
                            variation.setCategory(category.get());
                            variation.setName(pro.getVariationName());
                            variationRepository.save(variation);
                            VariationOption variationOption = new VariationOption();
                            variationOption.setValue(pro.getVariationOption());
                            variationOption.setVariation(variation);
                            variationOptionRepository.save(variationOption);
                            ProductConfiguration productConfiguration = new ProductConfiguration();
                            productConfiguration.setVariationOption(variationOption);
                            productConfiguration.setProductItem(productItem);
                            productConfigurations.add(productConfiguration);
                            variationOption.setProductConfigurations(productConfigurations);
                            variationOptions.add(variationOption);
                            variation.setVariationOptions(variationOptions);
                            variationList.add(variation);
                        }

                    }
                    category.get().getVariations().addAll(variationList);
                    var productConfigs = productItem.getProductConfigurations();
                    var list = new ArrayList<>();
                    if (!productConfigs.isEmpty()){
                        for (ProductConfiguration pad : productConfigs){
                            boolean flag = false;
                            long productConfigId = 0L;

                            loop:
                            {
                                for (ProductConfiguration pad1 : productConfigurations) {
                                    if (pad.getVariationOption().getValue().equals(pad1.getVariationOption().getValue())) {
                                        flag = true;
                                        productConfigId = pad.getId();
                                        break loop;
                                    }
                                }
                            }
                            if (!flag){
                                for (ProductConfiguration pad1 : productConfigurations) {
                                    if (pad.getVariationOption().getId().equals(pad1.getVariationOption().getId())) {
                                        pad.setVariationOption(pad1.getVariationOption());
                                    }
                                }
                            }
                        }
                    }

                    productItem.setProduct(product);
                    productItem.setProductImage(productItem.getProductImage() == null ? getURLPictureAndUploadToCloudinary(p.getProductImage()): productItem.getProductImage());
                    productItem.setActive(p.isActive());
                    productItem.setPrice(p.getPrice());
                    productItem.setQuantityInStock(p.getQuantityInStock());
                    productItemRepository.save(productItem);
                    variationRepository.saveAll(variationList);
                    variationOptionRepository.saveAll(variationOptions);
                    productConfigurationRepository.saveAll(productConfigurations);

                    productItems.add(productItem);
                }

                product.setProductItems(productItems);
                product.setCategory(category.get());
                product.setProductImage(ImageUtil.urlImage);
                productRepository.save(product);
                categoryRepository.save(category.get());
                return "Successfully update product";
            } else
                return "This category is not available to update product. Please try a sub-category of this category or another!";
        } else
            return "Not found any category to update product. Please create category first!";

    }

    public String getURLPictureAndUploadToCloudinary(String base64Content){
        byte[] fileBytes = FileUtil.base64ToBytes(base64Content);
        MultipartFile multipartFile = new ByteMultipartFile(fileBytes);
        Tika tika = new Tika();
        String mimetype = tika.detect(fileBytes);
        if (mimetype.contains("image")){
            Map<?, ?> map = cloudinaryService.uploadFile(multipartFile, "Product");
            return (String) map.get("secure_url");

        }
        else
            return ImageUtil.urlImage;
    }

}