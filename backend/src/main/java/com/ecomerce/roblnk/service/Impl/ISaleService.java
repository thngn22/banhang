package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.PageResponse;
import com.ecomerce.roblnk.dto.sale.*;
import com.ecomerce.roblnk.mapper.ProductMapper;
import com.ecomerce.roblnk.mapper.SaleMapper;
import com.ecomerce.roblnk.model.*;
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
import org.springframework.data.jpa.domain.Specification;
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
    public PageResponse getSaleResponses(FilterSaleRequest filterSaleRequest) {
        var sale_id = filterSaleRequest.getSale_id();
        var name = filterSaleRequest.getName();
        var discounted_rate = filterSaleRequest.getDiscount_rate();
        var state = filterSaleRequest.getState();
        var pageNumber = filterSaleRequest.getPageNumber() != null ? filterSaleRequest.getPageNumber() : 1;
        Specification<Sale> specification = specificationSale(sale_id, name, discounted_rate, state, filterSaleRequest.getStart_date(), filterSaleRequest.getEnd_date());
        var sales = saleRepository.findAll(specification);
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

    private Specification<Sale> specificationSale(Long sale_id, String name, Double discounted_rate, String state, Date start_date, Date end_date) {
        Specification<Sale> saleSpec = hasSaleId(sale_id);
        Specification<Sale> nameSpec = hasNameSale(name);
        Specification<Sale> discountedRateSpec = hasDiscountedRateSale(discounted_rate);
        Specification<Sale> stateSaleSpec = hasStateSale(state);
        Specification<Sale> startDateSaleSpec = hasStartDateSale(start_date);
        Specification<Sale> endDateSaleSpec = hasEndDateSale(end_date);
        Specification<Sale> specification = Specification.where(null);

        if (sale_id != null) {
            specification = specification.and(saleSpec);
        }
        if (name != null && !name.isEmpty()) {
            specification = specification.and(nameSpec);
        }
        if (discounted_rate != null) {
            specification = specification.and(discountedRateSpec);
        }
        if (state != null && !state.isEmpty()) {
            specification = specification.and(stateSaleSpec);
        }
        if (start_date != null) {
            specification = specification.and(startDateSaleSpec);
        }if (end_date != null) {
            specification = specification.and(endDateSaleSpec);
        }
        return specification;
    }

    private Specification<Sale> hasStartDateSale(Date startDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("startDate"), startDate);
    }

    private Specification<Sale> hasEndDateSale(Date endDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("endDate"), endDate);
    }

    private Specification<Sale> hasSaleId(Long saleId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("id"), saleId);
    }

    private Specification<Sale> hasNameSale(String name) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("name"), "%" + name + "%");
    }

    private Specification<Sale> hasDiscountedRateSale(Double discountedRate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("discountRate"), discountedRate);
    }

    private Specification<Sale> hasStateSale(String state) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("active"), state);
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
