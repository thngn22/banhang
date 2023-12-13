package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.order.OrdersResponse;
import com.ecomerce.roblnk.exception.OrderException;
import com.ecomerce.roblnk.model.Address;
import com.ecomerce.roblnk.model.Orders;
import com.ecomerce.roblnk.model.User;

import java.security.Principal;
import java.util.List;

public interface OrderService {
    Orders createOrder(User user, Address address) throws OrderException;
    Orders findOrderById(Long orderId) throws OrderException;
    List<Orders> userOrderHistory(Long userId);
    Orders placedOrder(Long orderId) throws OrderException;
    Orders confirmedOrder(Long orderId) throws OrderException;
    Orders shippedOrder(Long orderId) throws OrderException;
    Orders deliveredOrder(Long orderId) throws OrderException;
    Orders canceledOrder(Long orderId) throws OrderException;
}
