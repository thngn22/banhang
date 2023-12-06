package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.order.OrdersResponse;
import com.ecomerce.roblnk.model.Orders;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrdersResponse toOrderResponse(Orders orders);
    List<OrdersResponse> toOrderResponses(List<Orders> orders);

}
