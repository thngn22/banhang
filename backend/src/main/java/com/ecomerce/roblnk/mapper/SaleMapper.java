package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.sale.SaleResponse;
import com.ecomerce.roblnk.dto.sale.SaleResponseDetail;
import com.ecomerce.roblnk.model.Sale;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SaleMapper {
    SaleResponse toSaleResponse(Sale sale);
    List<SaleResponse> toSaleResponses(List<Sale> sales);
    SaleResponseDetail toSaleResponseDetail(Sale sale);
}
