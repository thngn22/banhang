package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.sale.EditFlashSaleRequest;
import com.ecomerce.roblnk.dto.sale.FlashSaleRequest;
import com.ecomerce.roblnk.dto.sale.SaleResponse;
import com.ecomerce.roblnk.dto.sale.SaleResponseDetail;

import java.util.List;

public interface SaleService {
    List<SaleResponse> getSaleResponses();

   SaleResponseDetail getSaleResponseDetail(Long id);

    String creatFlashSale(FlashSaleRequest flashSaleRequest);

    String editFlashSale(EditFlashSaleRequest editFlashSaleRequest);

    String deleteSale(Long id);
}
