package com.ecomerce.roblnk.dto.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueResponse {
    private Integer totalRevenue;
    private Integer totalFee;
    private Integer totalNumberOrders;
}
