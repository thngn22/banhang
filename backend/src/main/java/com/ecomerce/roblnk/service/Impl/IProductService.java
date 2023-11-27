package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.product.ProductDetailResponse;
import com.ecomerce.roblnk.dto.product.ProductRequest;
import com.ecomerce.roblnk.dto.product.ProductResponse;
import com.ecomerce.roblnk.mapper.ProductMapper;
import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.repository.CategoryRepository;
import com.ecomerce.roblnk.repository.ProductItemRepository;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.service.ProductService;
import jakarta.validation.Valid;
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
    private final ProductItemRepository productItemRepository;


    @Override
    public List<ProductResponse> getAllProduct(Long categoryId) {
        List<Category> categories = new ArrayList<>();
        List<Category> categoryList = new ArrayList<>();
        List<Product> products = new ArrayList<>();
        List<Integer> list = new ArrayList<>();
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
        for (Product product : products){
            var items = productItemRepository.findAllByProduct_Id(product.getId());
            list.add(items.size());
        }
        var productResponseList =  productMapper.toProductResponseList(products);
        for (int i = 0; i < productResponseList.size(); i++){
            productResponseList.get(i).setQuantity(list.get(i));
        }
        return productResponseList;
    }

    @Override
    public ProductDetailResponse getDetailProduct(Long productId) {
        var product = productRepository.findById(productId);
        if (product.isPresent()){
            var items = productItemRepository.findAllByProduct_Id(product.get().getId());
            var productDetail = productMapper.toDetailResponse(product.get());
            productDetail.setQuantity(items.size());
            return productDetail;
        }
        else
            return null;
    }

    @Override
    public String createProduct(Long id, @Valid ProductRequest request) {
        var category = categoryRepository.findById(id);
        return null;
    }


}