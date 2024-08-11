package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.dto.order.OrdersObject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueResponse {
    private Integer totalRevenue;
    private Integer newAccount;
    private Integer totalAccount;
    private Integer totalNumberOrdersSuccess;
    private Integer totalNumberOrdersFailure;
    private Integer totalNumberOrders;
    private List<OrdersObject> listOrdersRevenue;
}
