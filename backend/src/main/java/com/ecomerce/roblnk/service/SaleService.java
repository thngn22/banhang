package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.PageResponse;
import com.ecomerce.roblnk.dto.sale.EditFlashSaleRequest;
import com.ecomerce.roblnk.dto.sale.FilterSaleRequest;
import com.ecomerce.roblnk.dto.sale.FlashSaleRequest;
import com.ecomerce.roblnk.dto.sale.SaleResponseDetail;

public interface SaleService {
    PageResponse getSaleResponses(FilterSaleRequest filterSaleRequest);
    void updateSaleState(Long saleId);
    void updateAllSale();
    SaleResponseDetail getSaleResponseDetail(Long id);

    String creatFlashSale(FlashSaleRequest flashSaleRequest);

    String editFlashSale(EditFlashSaleRequest editFlashSaleRequest);

    String deleteSale(Long id);

    PageResponse getSaleProductsForUser(Integer filterSaleRequest);
}
