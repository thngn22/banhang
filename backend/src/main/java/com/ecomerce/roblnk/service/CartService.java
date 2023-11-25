package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.exception.ProductException;
import com.ecomerce.roblnk.model.Cart;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.dto.product.AddItemRequest;

public interface CartService {
    Cart createCart(User user);
    String addCartItem(Long userId, AddItemRequest request) throws ProductException;
    Cart findUserCart(Long userId);
}
