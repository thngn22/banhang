package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.exception.OrderException;
import com.ecomerce.roblnk.model.Address;
import com.ecomerce.roblnk.model.Order;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.repository.CartItemRepository;
import com.ecomerce.roblnk.repository.CartRepository;
import com.ecomerce.roblnk.service.OrderService;
import com.ecomerce.roblnk.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class IOrderService implements OrderService {

    private CartRepository cartRepository;
    private CartItemRepository cartItemRepository;
    private ProductService productService;
    @Override
    public Order createOrder(User user, Address address) throws OrderException {
        return null;
    }

    @Override
    public Order findOrderById(Long orderId) throws OrderException {
        return null;
    }

    @Override
    public List<Order> userOrderHistory(Long userId) {
        return null;
    }

    @Override
    public Order placedOrder(Long orderId) throws OrderException {
        return null;
    }

    @Override
    public Order confirmedOrder(Long orderId) throws OrderException {
        return null;
    }

    @Override
    public Order shippedOrder(Long orderId) throws OrderException {
        return null;
    }

    @Override
    public Order deliveredOrder(Long orderId) throws OrderException {
        return null;
    }

    @Override
    public Order canceledOrder(Long orderId) throws OrderException {
        return null;
    }
}
