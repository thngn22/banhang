package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.product.ProductDetailResponse;
import com.ecomerce.roblnk.dto.product.ProductResponse;
import com.ecomerce.roblnk.mapper.ProductMapper;
import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.repository.CategoryRepository;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IProductService implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;


    @Override
    public List<ProductResponse> getAllProduct(Long categoryId) {
        List<Category> categories = new ArrayList<>();
        List<Category> categoryList = new ArrayList<>();
        List<Product> products = new ArrayList<>();
        var cate = categoryRepository.findAll();
        var cateTarget = categoryRepository.findById(categoryId).orElseThrow();
        categories.add(cateTarget);
        while (!categories.isEmpty()){
            Long id = categories.get(0).getId();
            boolean flag = false;
            for (Category category : cate){
                if (category.getParentCategoryId() != null && category.getParentCategoryId().getId().equals(id)){
                    flag = true;
                    categories.add(category);
                }
            }
            if (flag){
                categories.remove(0);
            }
            else{
                categoryList.add(categories.get(0));
                categories.remove(0);

            }
        }
        for (Category category : categoryList) {
            products.addAll(productRepository.findAllByCategoryId(category.getId()));
        }
        return productMapper.toProductResponseList(products);
    }

    @Override
    public ProductDetailResponse getDetailProduct(Long productId) {
        var product = productRepository.findById(productId);
        return product.map(productMapper::toDetailResponse).orElse(null);
    }


}