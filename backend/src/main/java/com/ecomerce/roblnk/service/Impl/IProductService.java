package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.product.ProductResponse;
import com.ecomerce.roblnk.dto.product.RequestProduct;
import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.dto.product.CreateProductRequest;
import com.ecomerce.roblnk.service.ProductService;
import com.ecomerce.roblnk.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IProductService implements ProductService {

    private final ProductRepository productRepository;


   /* @Override
    public Product createProduct(CreateProductRequest req) {

        Category topLevel = categoryRepository.findByName(req.getTopLevelCategory());
        if (topLevel == null){
            Category topLevelCategory = new Category();
            topLevelCategory.setName(req.getTopLevelCategory());
            topLevelCategory.setLevel(1);

            topLevel = categoryRepository.save(topLevelCategory);
        }


        Category secondLevel = categoryRepository.findByNameAndParent(req.getSecondLevelCategory(), topLevel.getName());

        if(secondLevel == null){
            Category secondLevelCategory = new Category();
            secondLevelCategory.setName(req.getSecondLevelCategory());
            secondLevelCategory.setLevel(2);

            secondLevel = categoryRepository.save(secondLevelCategory);
        }

        Category thirdlevel = categoryRepository.findByNameAndParent(req.getThirdLevelCategory(), secondLevel.getName());
        if (thirdlevel == null){
            Category thirdLevelCategory = new Category();
            thirdLevelCategory.setName(req.getThirdLevelCategory());
            thirdLevelCategory.setLevel(3);

            thirdlevel = categoryRepository.save(thirdLevelCategory);
        }

        Product product = new Product();
        product.setTitle(req.getTitle());
        product.setColor(req.getColor());
        product.setDescription(req.getDescription());
        product.setDiscountedPrice(req.getDiscountedPrice());
        product.setDiscountPersent(req.getDiscountedPersent());
        product.setImageUrl(req.getImageUrl());
        product.setBrand(req.getBranch());
        product.setPrice(req.getPrice());
        product.setSizes(req.getSizes());
        product.setQuantity(req.getQuantity());
        product.setCategory(thirdlevel);
        product.setCreatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);
        return savedProduct;
    }

    @Override
    public String deleteProduct(Long productId) throws ProductException {
        Product product = findProductById(productId);
        product.getSizes().clear();
        productRepository.delete(product);
        return "Product deleted successfully";
    }

    @Override
    public Product updateProduct(Long productId, Product req) throws ProductException {
        Product product = findProductById(productId);
        if(req.getQuantity() != 0){
            product.setQuantity(req.getQuantity());
        }
        return productRepository.save(product);
    }*/

    @Override
    public ResponseEntity<?> createProduct(Integer categoryId, CreateProductRequest req) {
        var productList = productRepository.findAllByCategoryId(Long.valueOf(categoryId));
        System.out.println("Da lay dc category");
        if (productList.isPresent()) {
            for (Product p : productList.get()) {
                if (p.getName().equals(req.getName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Product existed in category! Please try another name!");
                }
            }
            var prod = Product.builder()
                    .name(req.getName())
                    .brand(req.getBrand())
                    .description(req.getDescription())
                    .price(req.getPrice())
                    .discountedPrice(req.getDiscountedPrice())
                    .discountPercent(req.getDiscountPercent())
                    .imageUrl(req.getImageUrl())
                    .stock(req.getStock())
                    .build();
            productRepository.save(prod);
            return ResponseEntity.status(HttpStatus.CREATED).body("Product added!");
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not Found Category!");
    }

    @Override
    public ResponseEntity<?> deleteProduct(Long productId) {
        try {
            productRepository.deleteById(productId);
        } catch (Exception e){
            throw new RuntimeException("Delete product failed! Product not found with error: " + e.getMessage());
        }
        return ResponseEntity.ok("Successfully deleted product!");
    }

    @Override
    public ResponseEntity<?> updateProduct(Long productId, RequestProduct requestProduct) {
        var product = productRepository.findById(productId).orElseThrow();
        if (requestProduct.getId().equals(product.getId())) {
            product.setName(requestProduct.getName());
            product.setBrand(requestProduct.getBrand());
            product.setDescription(requestProduct.getDescription());
            product.setPrice(requestProduct.getPrice());
            product.setDiscountedPrice(requestProduct.getDiscountedPrice());
            product.setDiscountPercent(requestProduct.getDiscountPercent());
            product.setImageUrl(requestProduct.getImageUrl());
        };
        productRepository.save(product);
        return ResponseEntity.ok("Update product successfully!");
    }

    @Override
    public ResponseEntity<?> findProductById(Long productId) {
        var product = productRepository.findById(productId).orElseThrow(()
                -> new UsernameNotFoundException("Product not found"));

        var productResponse = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountedPrice(product.getDiscountedPrice())
                .discountPercent(product.getDiscountPercent())
                .imageUrl(product.getImageUrl())
                .stock(product.getStock())
                .build();
        return ResponseEntity.ok(productResponse);
    }

    @Override
    public ResponseEntity<?> findProductByCategoryIdPageable(Long categoryId, Integer pageNumber, Integer pageSize) {
        Page<Product> productList = productRepository.findAllByCategoryId(categoryId, PageRequest.of(pageNumber, pageSize));
        List<ProductResponse> productResponseList = new ArrayList<>();
        for (Product product : productList){
            var productResponse = ProductResponse.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .brand(product.getBrand())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .discountedPrice(product.getDiscountedPrice())
                    .discountPercent(product.getDiscountPercent())
                    .imageUrl(product.getImageUrl())
                    .stock(product.getStock())
                    .build();
            productResponseList.add(productResponse);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("content", productResponseList);
        map.put("pageSize", productList.getSize());
        map.put("totalPages", productList.getTotalPages());
        map.put("totalElements", productList.getTotalElements());

        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    @Override
    public ResponseEntity<?> getAllProduct() {
        var pro = productRepository.findAll();
        return ResponseEntity.ok(pro);
    }

    /*@Override
    public ResponseEntity<?> getAllProduct(String category, List<String> colors, List<String> sizes, Double minPrice, Double maxPrice, Integer minDiscount, String sort, Double stock, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        List<Product> products = productRepository.findAllByCategory_NameAndDiscountedPriceBetween(category, minPrice, maxPrice)
                .orElseThrow(()-> new UsernameNotFoundException("Product not found!"));

        int startIndex = (int) pageable.getOffset();
        int endIndex = Math.min(startIndex + pageable.getPageSize(), products.size());
        List<Product> pageContent = products.subList(startIndex, endIndex);
        Page<Product> filteredProducts = new PageImpl<>(pageContent, pageable, products.size());

        return ResponseEntity.ok(filteredProducts);*/
    //}
}
