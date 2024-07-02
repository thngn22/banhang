package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.sale.EditFlashSaleRequest;
import com.ecomerce.roblnk.dto.sale.FlashSaleRequest;
import com.ecomerce.roblnk.dto.sale.SaleResponse;
import com.ecomerce.roblnk.dto.sale.SaleResponseDetail;
import com.ecomerce.roblnk.mapper.ProductMapper;
import com.ecomerce.roblnk.mapper.SaleMapper;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.model.ProductItem;
import com.ecomerce.roblnk.model.Sale;
import com.ecomerce.roblnk.repository.ProductItemRepository;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.repository.SaleRepository;
import com.ecomerce.roblnk.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ISaleService implements SaleService {

    private final SaleRepository saleRepository;
    private final SaleMapper saleMapper;
    private final ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final ProductItemRepository productItemRepository;
    @Override
    public List<SaleResponse> getSaleResponses() {
        var sales = saleRepository.findAll();
        return saleMapper.toSaleResponses(sales);
    }

    @Override
    public SaleResponseDetail getSaleResponseDetail(Long id) {
        List<Integer> quantity = new ArrayList<>();
        List<Integer> salePrices = new ArrayList<>();
        var sale = saleRepository.findById(id);
        if (sale.isPresent()) {

            var saleDetail = saleMapper.toSaleResponseDetail(sale.get());
            int i = 0;
            while (i < sale.get().getProducts().size()) {

                int total = 0;
                var items = productItemRepository.findAllByProduct_Id(sale.get().getProducts().get(i).getId());
                var estimatedPrice = 0.0;
                for (ProductItem productItem : items) {
                    total += productItem.getQuantityInStock();
                    estimatedPrice = productItem.getPrice();
                }
                quantity.add(total);
                if (sale.get().getProducts().get(i).getSale() != null && sale.get().isActive()
                        && sale.get().getEndDate().after(new Date(System.currentTimeMillis()))
                        && sale.get().getStartDate().before(new Date(System.currentTimeMillis()))){
                    double finalPrice = (estimatedPrice - estimatedPrice * 0.01 * sale.get().getProducts().get(i).getSale().getDiscountRate());
                    salePrices.add((int) (Math.round(finalPrice/1000.0) * 1000 + 1000));
                }
                else {
                    salePrices.add((int) estimatedPrice);
                }
                i++;
            }
            var productResponseList = productMapper.toProductResponseList(sale.get().getProducts());
            for (int j = 0; j < productResponseList.size(); j++) {
                productResponseList.get(j).setQuantity(quantity.get(j));
                productResponseList.get(j).setSalePrice(salePrices.get(j));
            }
            saleDetail.setProductResponses(productResponseList);
            return saleDetail;
        }
        else return null;
    }

    @Override
    public String creatFlashSale(FlashSaleRequest flashSaleRequest) {
        List<Product> products = new ArrayList<>();
        var sale = new Sale();
        sale.setName(flashSaleRequest.getName());
        sale.setDescription(flashSaleRequest.getDescription());
        sale.setStartDate(flashSaleRequest.getStartDate());
        sale.setDiscountRate(flashSaleRequest.getDiscountRate());
        sale.setEndDate(flashSaleRequest.getEndDate());
        sale.setCreatedAt(new Date(System.currentTimeMillis()));
        flashSaleRequest.getIdProductList().forEach(id -> {
            productRepository.findById(id).orElseThrow().setSale(sale);
        });
        sale.setProducts(products);
        sale.setActive(true);
        saleRepository.save(sale);
        return "Successfully created sale!";
    }

    @Override
    public String editFlashSale(EditFlashSaleRequest editFlashSaleRequest) {
        var sale = saleRepository.findById(editFlashSaleRequest.getId());
        List<Product> products = new ArrayList<>();
        if (sale.isPresent()) {
            if ((editFlashSaleRequest.getName() != null) && !editFlashSaleRequest.getName().isEmpty()){
                sale.get().setName(editFlashSaleRequest.getName());
            }
            if ((editFlashSaleRequest.getDescription() != null) && editFlashSaleRequest.getDescription().isEmpty()){
                sale.get().setDescription(editFlashSaleRequest.getDescription());
            }
            if (editFlashSaleRequest.getDiscountRate() != null){
                sale.get().setDiscountRate(editFlashSaleRequest.getDiscountRate());
            }
            if (editFlashSaleRequest.getStartDate() != null){
                sale.get().setStartDate(editFlashSaleRequest.getStartDate());
            }
            if (editFlashSaleRequest.getEndDate() != null){
                sale.get().setEndDate(editFlashSaleRequest.getEndDate());
            }
            sale.get().setActive(editFlashSaleRequest.isActive());
            sale.get().getProducts().forEach(product -> {
                if (!editFlashSaleRequest.getIdProductList().contains(product.getId()))
                   product.setSale(null);
            });
            editFlashSaleRequest.getIdProductList().forEach(id -> {
                productRepository.findById(id).orElseThrow().setSale(sale.get());
            });
            sale.get().setActive(editFlashSaleRequest.isActive());

            saleRepository.save(sale.get());
            return "Successfully edited sale!";
        }
        else return "Not found product to add to sale, please try again!!";
    }

    @Override
    public String deleteSale(Long id) {
        var sale = saleRepository.findById(id);
        if (sale.isPresent()) {
            if (sale.get().isActive()) {
                sale.get().setActive(false);
                saleRepository.save(sale.get());
                return "Successfully deactive sale";
            } else {
                sale.get().setActive(true);
                saleRepository.save(sale.get());
                return "Successfully active sale";
            }
        } else
            return "Sale not found or not available to delete!";
    }
}
