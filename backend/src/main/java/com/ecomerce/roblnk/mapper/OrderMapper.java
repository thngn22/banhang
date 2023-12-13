package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.order.OrderItemDTO;
import com.ecomerce.roblnk.dto.order.OrderResponsev2;
import com.ecomerce.roblnk.dto.order.OrdersResponse;
import com.ecomerce.roblnk.dto.order.PaymentMethodDTO;
import com.ecomerce.roblnk.model.OrderItem;
import com.ecomerce.roblnk.model.Orders;
import com.ecomerce.roblnk.model.UserPaymentMethod;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(source = "statusOrder.orderStatus", target = "statusOrder")
    OrdersResponse toOrderResponse(Orders orders);


    @Mapping(source = "productItem.id", target = "productItemId")
    @Mapping(source = "productItem.productImage", target = "productItemImage")
    @Mapping(source = "productItem.name", target = "productItemName")
    @Mapping(source = "productItem.product.id", target = "productId")
    OrderItemDTO toOrderItemDTO(OrderItem orderItem);
    List<OrderItemDTO> toOrderItemDTOs(List<OrderItem> orderItems);
    @Mapping(source = "statusOrder.orderStatus", target = "statusOrder")
    OrderResponsev2 toOrderResponsev2(Orders orders);
    List<OrderResponsev2> toOrderResponsev2s(List<Orders> orders);


    @Mapping(source = "paymentMethod.id", target = "paymentMethodId")
    @Mapping(source = "paymentMethod.nameMethod", target = "nameMethod")
    PaymentMethodDTO toPaymentMethodDTO(UserPaymentMethod userPaymentMethod);
    List<OrdersResponse> toOrderResponses(List<Orders> ordersList);

}
