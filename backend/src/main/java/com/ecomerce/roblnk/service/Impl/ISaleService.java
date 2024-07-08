package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.PageResponse;
import com.ecomerce.roblnk.dto.sale.EditFlashSaleRequest;
import com.ecomerce.roblnk.dto.sale.FlashSaleRequest;
import com.ecomerce.roblnk.dto.sale.SaleResponse;
import com.ecomerce.roblnk.dto.sale.SaleResponseDetail;
import com.ecomerce.roblnk.dto.voucher.VoucherResponse;
import com.ecomerce.roblnk.mapper.ProductMapper;
import com.ecomerce.roblnk.mapper.SaleMapper;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.model.ProductItem;
import com.ecomerce.roblnk.model.Sale;
import com.ecomerce.roblnk.model.SaleProduct;
import com.ecomerce.roblnk.repository.ProductItemRepository;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.repository.SaleProductRepository;
import com.ecomerce.roblnk.repository.SaleRepository;
import com.ecomerce.roblnk.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.ecomerce.roblnk.util.PageUtil.PAGE_SIZE_ADMIN;

@Service
@RequiredArgsConstructor
public class ISaleService implements SaleService {

    private final SaleRepository saleRepository;
    private final SaleProductRepository saleProductRepository;
    private final SaleMapper saleMapper;
    private final ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final ProductItemRepository productItemRepository;

    @Override
    public PageResponse getSaleResponses(Integer pageNumber) {

        var sales = saleRepository.findAll();
        var saleResponse = saleMapper.toSaleResponses(sales);
        Pageable pageable = PageRequest.of(Math.max(pageNumber - 1, 0), PAGE_SIZE_ADMIN);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), saleResponse.size());
        List<SaleResponse> pageContent = new ArrayList<>();
        if (start < end) {
            pageContent = saleResponse.subList(start, end);

        }
        Page<SaleResponse> page = new PageImpl<>(pageContent, pageable, saleResponse.size());
        PageResponse productResponse = new PageResponse();
        productResponse.setContents(pageContent);
        productResponse.setPageSize(page.getSize());
        productResponse.setPageNumber(page.getNumber() + 1);
        productResponse.setTotalPage(page.getTotalPages());
        productResponse.setTotalElements(page.getTotalElements());
        return productResponse;
    }

    @Override
    public SaleResponseDetail getSaleResponseDetail(Long id) {
        List<Integer> quantity = new ArrayList<>();
        List<Integer> salePrices = new ArrayList<>();
        List<Long> saleId = new ArrayList<>();
        var sale = saleRepository.findById(id);
        if (sale.isPresent()) {

            var saleDetail = saleMapper.toSaleResponseDetail(sale.get());
            int i = 0;
            while (i < sale.get().getSaleProducts().size()) {

                int total = 0;
                var items = productItemRepository.findAllByProduct_Id(sale.get().getSaleProducts().get(i).getProduct().getId());
                var estimatedPrice = 0.0;
                for (ProductItem productItem : items) {
                    total += productItem.getQuantityInStock();
                    estimatedPrice = productItem.getPrice();
                }
                quantity.add(total);
                if (sale.get().getSaleProducts().get(i).getSale() != null && sale.get().isActive()
                        && sale.get().getEndDate().after(new Date(System.currentTimeMillis()))
                        && sale.get().getStartDate().before(new Date(System.currentTimeMillis()))) {
                    double finalPrice = (estimatedPrice - estimatedPrice * 0.01 * sale.get().getDiscountRate());
                    salePrices.add((int) (Math.round(finalPrice / 1000.0) * 1000 + 1000));
                } else {
                    salePrices.add((int) estimatedPrice);
                }
                i++;
            }
            List<Product> products = new ArrayList<>();
            for (SaleProduct saleProduct : sale.get().getSaleProducts()){
                products.add(saleProduct.getProduct());
            }
            saleProductRepository.findAllBySale_Id(id).forEach(saleProduct -> {
                saleId.add(saleProduct.getSale().getId());
            });

            var productResponseList = productMapper.toProductResponseList(products);
            for (int j = 0; j < productResponseList.size(); j++) {
                productResponseList.get(j).setQuantity(quantity.get(j));
                productResponseList.get(j).setSalePrice(salePrices.get(j));
                productResponseList.get(j).setDiscountRate(saleDetail.getDiscountRate());
                productResponseList.get(j).setSaleId(saleId.get(j));
            }
            saleDetail.setProductResponses(productResponseList);
            return saleDetail;
        } else return null;
    }

    @Override
    public String creatFlashSale(FlashSaleRequest flashSaleRequest) {
        for (Long id : flashSaleRequest.getIdProductList()) {
            var currentSaleProduct = saleProductRepository.findSaleProductByProduct_IdAndSaleNotNullAndSale_Active(id, true);
            if (currentSaleProduct.isPresent()) {
                if (currentSaleProduct.get().getSale().isActive())
                    return "One of product in list is applied another sale, please try another product";
            }
        }
        var sale = new Sale();
        sale.setName(flashSaleRequest.getName());
        sale.setDescription(flashSaleRequest.getDescription());
        sale.setStartDate(flashSaleRequest.getStartDate());
        sale.setDiscountRate(flashSaleRequest.getDiscountRate());
        sale.setEndDate(flashSaleRequest.getEndDate());
        sale.setCreatedAt(new Date(System.currentTimeMillis()));
        sale.setActive(true);
        saleRepository.save(sale);
        flashSaleRequest.getIdProductList().forEach(id -> {
            var saleProduct = new SaleProduct();
            saleProduct.setProduct(productRepository.findById(id).orElseThrow());
            saleProduct.setSale(sale);
            saleProductRepository.save(saleProduct);
        });

        return "Successfully created sale!";
    }

    @Override
    public String editFlashSale(EditFlashSaleRequest editFlashSaleRequest) {
        var sale = saleRepository.findById(editFlashSaleRequest.getId());
        if (sale.isPresent()) {
            if (sale.get().isActive()) {
                if ((editFlashSaleRequest.getName() != null) && !editFlashSaleRequest.getName().isEmpty()) {
                    sale.get().setName(editFlashSaleRequest.getName());
                }
                if ((editFlashSaleRequest.getDescription() != null) && editFlashSaleRequest.getDescription().isEmpty()) {
                    sale.get().setDescription(editFlashSaleRequest.getDescription());
                }
                if (editFlashSaleRequest.getDiscountRate() != null) {
                    sale.get().setDiscountRate(editFlashSaleRequest.getDiscountRate());
                }
                if (editFlashSaleRequest.getStartDate() != null) {
                    sale.get().setStartDate(editFlashSaleRequest.getStartDate());
                }
                if (editFlashSaleRequest.getEndDate() != null) {
                    sale.get().setEndDate(editFlashSaleRequest.getEndDate());
                }
                for (SaleProduct saleProduct : sale.get().getSaleProducts()) {
                    if (!editFlashSaleRequest.getIdProductList().contains(saleProduct.getProduct().getId()))
                        saleProduct.setSale(null);
                }

                editFlashSaleRequest.getIdProductList().forEach(id -> {
                    var saleProduct = saleProductRepository.findSaleProductByProduct_IdAndSale_Id(id, editFlashSaleRequest.getId());
                    if (saleProduct.isEmpty()) {
                        var newSaleProduct = new SaleProduct();
                        newSaleProduct.setProduct(productRepository.findById(id).orElseThrow());
                        newSaleProduct.setSale(sale.get());
                        saleProductRepository.save(newSaleProduct);
                    }
                });
                saleRepository.save(sale.get());
                return "Successfully edited sale!";
            }
            else return "Sale is de-actived, not available to edit!";
        } else return "Not found product to add to sale, please try again!!";
    }

    @Override
    public String deleteSale(Long id) {
        var sale = saleRepository.findById(id);
        if (sale.isPresent()) {
            sale.get().setActive(false);
            saleRepository.save(sale.get());
            return "Successfully deactive sale";
        } else
            return "Sale not found or not available to delete!";
    }
}
