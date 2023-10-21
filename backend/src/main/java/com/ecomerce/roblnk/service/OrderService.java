package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.exception.OrderException;
import com.ecomerce.roblnk.model.Address;
import com.ecomerce.roblnk.model.Order;
import com.ecomerce.roblnk.model.User;

import java.util.List;

public interface OrderService {
    Order createOrder(User user, Address address) throws OrderException;
    Order findOrderById(Long orderId) throws OrderException;
    List<Order> userOrderHistory(Long userId);
    Order placedOrder(Long orderId) throws OrderException;
    Order confirmedOrder(Long orderId) throws OrderException;
    Order shippedOrder(Long orderId) throws OrderException;
    Order deliveredOrder(Long orderId) throws OrderException;
    Order canceledOrder(Long orderId) throws OrderException;

}
