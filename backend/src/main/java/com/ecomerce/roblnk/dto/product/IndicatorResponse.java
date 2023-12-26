package com.ecomerce.roblnk.dto.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IndicatorResponse {
    private Integer totalRevenue;
    private Integer newAccount;
    private Integer totalAccount;
    private Integer totalNumberOrdersSuccess;
    private Integer totalNumberOrdersFailure;
    private Integer totalNumberOrders;
}
